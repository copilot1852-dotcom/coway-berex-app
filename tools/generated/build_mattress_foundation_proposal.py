import json
import math
import re
import subprocess
import zipfile
from datetime import date
from pathlib import Path

from docx import Document
from docx.enum.section import WD_SECTION
from docx.enum.table import WD_ALIGN_VERTICAL, WD_TABLE_ALIGNMENT
from docx.enum.text import WD_ALIGN_PARAGRAPH
from docx.oxml import OxmlElement
from docx.oxml.ns import qn
from docx.shared import Inches, Pt, RGBColor


ROOT = Path(__file__).resolve().parents[2]
INDEX = ROOT / "index.html"
OUT = ROOT / "proposal_output" / "비렉스_5년_서비스프리_매트리스_파운데이션_비교제안서.docx"
NODE = Path("/Users/minmacbook/.cache/codex-runtimes/codex-primary-runtime/dependencies/node/bin/node")

ACCENT = RGBColor(31, 77, 120)
BLUE = RGBColor(46, 116, 181)
DARK = RGBColor(34, 34, 34)
MUTED = RGBColor(102, 102, 102)
GREEN = RGBColor(38, 112, 74)
RED = RGBColor(156, 44, 44)
LIGHT_BLUE = "E8EEF5"
LIGHT_GRAY = "F2F4F7"
PALE_GREEN = "EAF4EF"


MODEL_ADD_FEES = {
    "hybrid4": 5000,
    "lunaire": 4000,
    "modi": 4000,
    "elite": 1000,
    "smarts8": 4000,
    "sigsc": 6000,
    "doubleside": 2000,
    "doublechainge": 5000,
    "compactfoam": 2000,
}

NO_TOPPER_MODELS = {"sigs", "compactfoam", "smarts8"}


def extract_js_object(source, const_name):
    marker = f"const {const_name} ="
    start = source.index(marker)
    brace_start = source.index("{", start)
    depth = 0
    in_str = None
    escape = False
    for i in range(brace_start, len(source)):
        ch = source[i]
        if in_str:
            if escape:
                escape = False
            elif ch == "\\":
                escape = True
            elif ch == in_str:
                in_str = None
            continue
        if ch in ("'", '"', "`"):
            in_str = ch
            continue
        if ch == "{":
            depth += 1
        elif ch == "}":
            depth -= 1
            if depth == 0:
                return source[brace_start : i + 1]
    raise RuntimeError(f"Could not extract {const_name}")


def load_product_data():
    source = INDEX.read_text(encoding="utf-8")
    obj = extract_js_object(source, "PRODUCT_DATA")
    code = f"const PRODUCT_DATA = {obj}; process.stdout.write(JSON.stringify(PRODUCT_DATA));"
    result = subprocess.run([str(NODE), "-e", code], check=True, capture_output=True, text=True)
    return json.loads(result.stdout)


def ceil10(value):
    return int(math.ceil(value / 10.0) * 10)


def money(value):
    return f"{int(round(value)):,}원"


def manwon(value):
    return f"{round(value / 10000, 1):,.1f}만원"


def pricing(m_key, m_item, f_item):
    period = 5
    months = 60
    discount_rate = 0.10
    half_months = 6

    raw_monthly = m_item["rentalData"][str(period)]["monthly"]
    effective_care = "serviceFree"
    if m_key in NO_TOPPER_MODELS and effective_care == "special":
        effective_care = "serviceFree"

    c_fee = 0
    a_fee = 0
    m_bc = 4000
    m_le = 5000 if m_key == "lunaire" else 0
    m_se = 9000 if m_key == "smarts8" else 0
    sf_mbc = 4000
    m_base = raw_monthly - sf_mbc + c_fee + a_fee + m_le + m_se
    m_pre_pkg = m_base - 1000 - m_bc - m_le - m_se
    m_pkg_d = ceil10(m_pre_pkg * discount_rate)
    m_final = max(0, m_pre_pkg - m_pkg_d)

    f_raw = f_item["rentalData"][str(period)]["monthly"]
    f_pre_pkg = f_raw
    f_pkg_d = ceil10(f_pre_pkg * discount_rate)
    f_final = max(0, f_pre_pkg - f_pkg_d)

    monthly = m_final + f_final
    promo = monthly * 0.5 * half_months
    rent_total = monthly * months - promo
    lump_total = int(m_item["price"]) + int(f_item["price"])
    saving = lump_total - rent_total
    return {
        "m_monthly": m_final,
        "f_monthly": f_final,
        "monthly": monthly,
        "rent_total": rent_total,
        "lump_total": lump_total,
        "saving": saving,
        "saving_rate": saving / lump_total if lump_total else 0,
        "m_model_no": m_item.get("modelNo", ""),
        "f_model_no": f_item.get("modelNo", ""),
        "m_pre_pkg": m_pre_pkg,
        "f_pre_pkg": f_pre_pkg,
        "m_pkg_d": m_pkg_d,
        "f_pkg_d": f_pkg_d,
    }


def build_rows(data):
    foundation_items = {item["size"]: item for item in data["frames"]["foundation"]["items"] if "5" in item["rentalData"]}
    rows = []
    for m_key, mattress in data["mattresses"].items():
        for item in mattress["items"]:
            size = item["size"]
            if size not in foundation_items:
                continue
            if "5" not in item.get("rentalData", {}):
                continue
            p = pricing(m_key, item, foundation_items[size])
            rows.append(
                {
                    "m_key": m_key,
                    "mattress": mattress["name"],
                    "size": size,
                    "height": mattress.get("height", 0),
                    "m_price": int(item["price"]),
                    **p,
                }
            )
    size_rank = {"슈싱": 0, "퀸": 1, "킹": 2, "라지킹": 3, "그레이트킹": 4}
    return sorted(rows, key=lambda r: (r["mattress"], size_rank.get(r["size"], 99)))


def set_cell_shading(cell, fill):
    tc_pr = cell._tc.get_or_add_tcPr()
    shd = tc_pr.find(qn("w:shd"))
    if shd is None:
        shd = OxmlElement("w:shd")
        tc_pr.append(shd)
    shd.set(qn("w:fill"), fill)


def set_cell_margins(cell, top=80, start=120, bottom=80, end=120):
    tc = cell._tc
    tc_pr = tc.get_or_add_tcPr()
    tc_mar = tc_pr.first_child_found_in("w:tcMar")
    if tc_mar is None:
        tc_mar = OxmlElement("w:tcMar")
        tc_pr.append(tc_mar)
    for m, v in {"top": top, "start": start, "bottom": bottom, "end": end}.items():
        node = tc_mar.find(qn(f"w:{m}"))
        if node is None:
            node = OxmlElement(f"w:{m}")
            tc_mar.append(node)
        node.set(qn("w:w"), str(v))
        node.set(qn("w:type"), "dxa")


def set_table_borders(table, color="B7C6D6", size="4"):
    tbl_pr = table._tbl.tblPr
    borders = tbl_pr.first_child_found_in("w:tblBorders")
    if borders is None:
        borders = OxmlElement("w:tblBorders")
        tbl_pr.append(borders)
    for edge in ("top", "left", "bottom", "right", "insideH", "insideV"):
        tag = f"w:{edge}"
        element = borders.find(qn(tag))
        if element is None:
            element = OxmlElement(tag)
            borders.append(element)
        element.set(qn("w:val"), "single")
        element.set(qn("w:sz"), size)
        element.set(qn("w:space"), "0")
        element.set(qn("w:color"), color)


def set_table_widths(table, widths):
    table.autofit = False
    table.alignment = WD_TABLE_ALIGNMENT.CENTER
    for row in table.rows:
        for idx, width in enumerate(widths):
            cell = row.cells[idx]
            cell.width = Inches(width)
            tc_pr = cell._tc.get_or_add_tcPr()
            tc_w = tc_pr.find(qn("w:tcW"))
            if tc_w is None:
                tc_w = OxmlElement("w:tcW")
                tc_pr.append(tc_w)
            tc_w.set(qn("w:w"), str(int(width * 1440)))
            tc_w.set(qn("w:type"), "dxa")


def set_run_font(run, size=None, color=None, bold=None, name="Calibri"):
    run.font.name = name
    run._element.rPr.rFonts.set(qn("w:ascii"), name)
    run._element.rPr.rFonts.set(qn("w:hAnsi"), name)
    if size is not None:
        run.font.size = Pt(size)
    if color is not None:
        run.font.color.rgb = color
    if bold is not None:
        run.bold = bold


def add_para(doc, text="", size=11, color=DARK, bold=False, after=6, before=0, align=None):
    p = doc.add_paragraph()
    p.paragraph_format.space_before = Pt(before)
    p.paragraph_format.space_after = Pt(after)
    p.paragraph_format.line_spacing = 1.10
    if align is not None:
        p.alignment = align
    run = p.add_run(text)
    set_run_font(run, size=size, color=color, bold=bold)
    return p


def add_heading(doc, text, level=1):
    p = doc.add_paragraph()
    p.paragraph_format.space_before = Pt(16 if level == 1 else 12)
    p.paragraph_format.space_after = Pt(8 if level == 1 else 6)
    run = p.add_run(text)
    set_run_font(run, size=16 if level == 1 else 13, color=BLUE if level == 1 else ACCENT, bold=True)
    return p


def add_metric_table(doc, metrics):
    table = doc.add_table(rows=1, cols=len(metrics))
    set_table_borders(table, color="D5DEE8", size="4")
    set_table_widths(table, [6.5 / len(metrics)] * len(metrics))
    row = table.rows[0]
    for idx, (label, value, note) in enumerate(metrics):
        cell = row.cells[idx]
        set_cell_shading(cell, PALE_GREEN if idx == 1 else LIGHT_GRAY)
        set_cell_margins(cell, top=140, bottom=140, start=140, end=140)
        cell.vertical_alignment = WD_ALIGN_VERTICAL.CENTER
        p = cell.paragraphs[0]
        p.alignment = WD_ALIGN_PARAGRAPH.CENTER
        p.paragraph_format.space_after = Pt(2)
        r = p.add_run(label)
        set_run_font(r, size=9, color=MUTED, bold=True)
        p2 = cell.add_paragraph()
        p2.alignment = WD_ALIGN_PARAGRAPH.CENTER
        p2.paragraph_format.space_after = Pt(2)
        r2 = p2.add_run(value)
        set_run_font(r2, size=15, color=GREEN if idx == 1 else ACCENT, bold=True)
        p3 = cell.add_paragraph()
        p3.alignment = WD_ALIGN_PARAGRAPH.CENTER
        p3.paragraph_format.space_after = Pt(0)
        r3 = p3.add_run(note)
        set_run_font(r3, size=8.5, color=MUTED)
    return table


def add_simple_table(doc, headers, rows, widths, header_fill=LIGHT_BLUE, font_size=8.5):
    table = doc.add_table(rows=1, cols=len(headers))
    set_table_borders(table)
    set_table_widths(table, widths)
    tr_pr = table.rows[0]._tr.get_or_add_trPr()
    tbl_header = OxmlElement("w:tblHeader")
    tbl_header.set(qn("w:val"), "true")
    tr_pr.append(tbl_header)
    for idx, header in enumerate(headers):
        cell = table.rows[0].cells[idx]
        set_cell_shading(cell, header_fill)
        set_cell_margins(cell, top=90, bottom=90, start=100, end=100)
        cell.vertical_alignment = WD_ALIGN_VERTICAL.CENTER
        p = cell.paragraphs[0]
        p.alignment = WD_ALIGN_PARAGRAPH.CENTER
        p.paragraph_format.space_after = Pt(0)
        r = p.add_run(header)
        set_run_font(r, size=8.5, color=ACCENT, bold=True)
    for row in rows:
        cells = table.add_row().cells
        for idx, val in enumerate(row):
            cell = cells[idx]
            set_cell_margins(cell, top=75, bottom=75, start=95, end=95)
            cell.vertical_alignment = WD_ALIGN_VERTICAL.CENTER
            p = cell.paragraphs[0]
            p.alignment = WD_ALIGN_PARAGRAPH.LEFT if idx in (0, 1) else WD_ALIGN_PARAGRAPH.RIGHT
            p.paragraph_format.space_after = Pt(0)
            r = p.add_run(str(val))
            color = GREEN if idx == len(row) - 1 and not str(val).startswith("-") else DARK
            set_run_font(r, size=font_size, color=color, bold=idx == len(row) - 1)
    return table


def add_bullet(doc, text):
    p = doc.add_paragraph(style=None)
    p.paragraph_format.left_indent = Inches(0.25)
    p.paragraph_format.first_line_indent = Inches(-0.12)
    p.paragraph_format.space_after = Pt(4)
    p.paragraph_format.line_spacing = 1.10
    r = p.add_run("• ")
    set_run_font(r, size=10.5, color=ACCENT, bold=True)
    r2 = p.add_run(text)
    set_run_font(r2, size=10.5, color=DARK)


def add_callout(doc, title, body):
    table = doc.add_table(rows=1, cols=1)
    set_table_borders(table, color="C7D8C7", size="6")
    set_table_widths(table, [6.5])
    cell = table.cell(0, 0)
    set_cell_shading(cell, PALE_GREEN)
    set_cell_margins(cell, top=130, bottom=130, start=160, end=160)
    p = cell.paragraphs[0]
    p.paragraph_format.space_after = Pt(4)
    r = p.add_run(title)
    set_run_font(r, size=11, color=GREEN, bold=True)
    p2 = cell.add_paragraph()
    p2.paragraph_format.space_after = Pt(0)
    p2.paragraph_format.line_spacing = 1.10
    r2 = p2.add_run(body)
    set_run_font(r2, size=10.2, color=DARK)


def set_document_styles(doc):
    section = doc.sections[0]
    section.page_width = Inches(8.5)
    section.page_height = Inches(11)
    section.top_margin = Inches(0.78)
    section.bottom_margin = Inches(0.78)
    section.left_margin = Inches(0.78)
    section.right_margin = Inches(0.78)
    section.header_distance = Inches(0.35)
    section.footer_distance = Inches(0.35)
    styles = doc.styles
    normal = styles["Normal"]
    normal.font.name = "Calibri"
    normal._element.rPr.rFonts.set(qn("w:ascii"), "Calibri")
    normal._element.rPr.rFonts.set(qn("w:hAnsi"), "Calibri")
    normal.font.size = Pt(11)
    normal.paragraph_format.space_after = Pt(6)
    normal.paragraph_format.line_spacing = 1.10

    header = section.header.paragraphs[0]
    header.text = "비렉스 5년 서비스프리 세트 비교 제안"
    header.alignment = WD_ALIGN_PARAGRAPH.RIGHT
    for run in header.runs:
        set_run_font(run, size=8.5, color=MUTED)

    footer = section.footer.paragraphs[0]
    footer.text = "앱 등록 가격 기준 · 고객 안내용"
    footer.alignment = WD_ALIGN_PARAGRAPH.CENTER
    for run in footer.runs:
        set_run_font(run, size=8.5, color=MUTED)


def add_title_page(doc, rows, summary):
    add_para(doc, "CUSTOMER PROPOSAL", size=9, color=MUTED, bold=True, after=4, before=18, align=WD_ALIGN_PARAGRAPH.CENTER)
    title = doc.add_paragraph()
    title.alignment = WD_ALIGN_PARAGRAPH.CENTER
    title.paragraph_format.space_after = Pt(6)
    run = title.add_run("5년 서비스프리\n매트리스+파운데이션 비용 비교 제안")
    set_run_font(run, size=24, color=ACCENT, bold=True)
    add_para(
        doc,
        "일시불 총액과 5년 총렌탈료를 같은 기준으로 놓고 비교한 고객 안내 자료",
        size=12,
        color=MUTED,
        after=20,
        align=WD_ALIGN_PARAGRAPH.CENTER,
    )
    add_metric_table(
        doc,
        [
            ("비교 조합", f"{len(rows)}개", "앱 등록 매트리스 × 파운데이션"),
            ("렌탈 우위", f"{summary['positive_count']}개", "일시불보다 총렌탈료가 낮은 조합"),
            ("평균 절감", manwon(summary["avg_saving"]), "일시불 총액 대비"),
        ],
    )
    add_para(doc, "", after=8)
    add_callout(
        doc,
        "제안의 핵심",
        "일시불이 항상 더 저렴하다는 상식과 달리, 현재 6월 프로모션 기준으로 매트리스와 파운데이션을 함께 렌탈하시면 "
        "5년 서비스프리 총렌탈료가 일시불 합산가보다 어떤 제품을 선택하시든 저렴하게 산출됩니다.",
    )
    add_heading(doc, "비교 기준", level=1)
    for text in [
        "약정과 옵션: 5년 약정, 서비스프리, 매트리스 1대 + 파운데이션 1대.",
        "총렌탈료: 월 렌탈료 60개월 합계에서 5년 혜택인 6개월 반값 금액을 차감.",
        "월 렌탈료: 신규 2개 세트 기준 앱 패키지 할인 10%와 자동이체 기준 월납부액을 반영.",
        "일시불 총액: 앱 등록 매트리스 일시불가와 파운데이션 일시불가의 단순 합산.",
    ]:
        add_bullet(doc, text)
    add_para(doc, "산출일: 2026년 6월 3일 · 출처: 현재 앱 index.html 등록 가격 및 계산식", size=9.5, color=MUTED, after=0)


def add_insights(doc, rows):
    add_heading(doc, "고객에게 보여줄 설명 포인트", level=1)
    top = max(rows, key=lambda r: r["saving"])
    low = min(rows, key=lambda r: r["saving"])
    avg_rate = sum(r["saving_rate"] for r in rows) / len(rows)
    for text in [
        f"전체 {len(rows)}개 조합 중 {sum(1 for r in rows if r['saving'] > 0)}개 조합에서 총렌탈료가 일시불 총액보다 낮습니다.",
        f"가장 절감폭이 큰 조합은 {top['mattress']}+파운데이션 {top['size']}이며, 일시불 대비 {manwon(top['saving'])} 낮습니다.",
        f"평균 절감률은 약 {avg_rate * 100:.1f}%로, 단순히 월 납입을 나눈 것이 아니라 총액 기준으로도 비교 가치가 있습니다.",
        "서비스프리는 방문관리 비용을 줄이고 필요한 혜택만 남긴 절약형 옵션이므로, 총액 비교에서 렌탈의 장점이 더 명확하게 드러납니다.",
        f"가장 차이가 작은 조합도 {low['mattress']}+파운데이션 {low['size']} 기준 {money(low['saving'])} 차이로 산출되어, 고객에게 숨길 숫자가 없습니다.",
    ]:
        add_bullet(doc, text)
    add_heading(doc, "대표 조합 비교", level=1)
    representative = sorted(rows, key=lambda r: r["saving"], reverse=True)[:8]
    add_simple_table(
        doc,
        ["조합", "사이즈", "월 렌탈료", "총렌탈료", "일시불 총액", "일시불 대비"],
        [
            [
                f"{r['mattress']} + 파운데이션",
                r["size"],
                money(r["monthly"]),
                money(r["rent_total"]),
                money(r["lump_total"]),
                f"{manwon(r['saving'])} 낮음",
            ]
            for r in representative
        ],
        [1.65, 0.58, 0.92, 1.18, 1.18, 0.99],
        font_size=8.5,
    )
    add_para(doc, "대표 조합은 일시불 대비 절감액이 큰 순서로 정렬했습니다.", size=9, color=MUTED, after=2)


def add_full_table(doc, rows):
    doc.add_section(WD_SECTION.NEW_PAGE)
    add_heading(doc, "전체 조합 상세표", level=1)
    add_para(
        doc,
        "아래 표는 앱에 등록된 매트리스 중 파운데이션과 같은 사이즈로 5년 약정 선택이 가능한 조합 전체입니다.",
        size=10,
        color=MUTED,
        after=8,
    )
    table_rows = []
    size_rank = {"슈싱": 0, "퀸": 1, "킹": 2, "라지킹": 3}
    for r in sorted(rows, key=lambda x: (size_rank.get(x["size"], 99), x["m_price"], x["mattress"])):
        table_rows.append(
            [
                r["mattress"],
                r["size"],
                money(r["m_monthly"]),
                money(r["f_monthly"]),
                money(r["monthly"]),
                money(r["rent_total"]),
                money(r["lump_total"]),
                f"{manwon(r['saving'])}",
            ]
        )
    add_simple_table(
        doc,
        ["매트리스", "사이즈", "매트 월", "파데 월", "월 합계", "5년 총렌탈료", "일시불 총액", "차액"],
        table_rows,
        [1.18, 0.48, 0.72, 0.72, 0.74, 1.02, 1.02, 0.62],
        font_size=7.1,
    )
    add_para(doc, "차액은 일시불 총액 - 5년 총렌탈료입니다. 양수이면 렌탈 총액이 더 낮다는 뜻입니다.", size=8.8, color=MUTED, after=8)


def add_customer_script(doc):
    add_heading(doc, "고객 설명 문구", level=1)
    add_callout(
        doc,
        "상담 시 권장 문장",
        "“고객님, 보통은 일시불이 렌탈보다 저렴하다고 생각하시는데요. 그런데 지금은 6월 프로모션 기준으로 매트리스와 파운데이션을 함께 렌탈하시면, "
        "5년 서비스프리 총렌탈료가 일시불 합산가보다 어떤 제품을 선택하시든 저렴하게 렌탈이 가능하십니다. "
        "월 납입액만 보는 것이 아니라 60개월 총렌탈료와 일시불 합산가를 나란히 비교한 자료라, 실제 부담 차이를 투명하게 확인하실 수 있습니다.”",
    )
    add_heading(doc, "유의사항", level=2)
    for text in [
        "본 자료는 현재 앱에 등록된 가격과 6월 프로모션 계산식 기준이며, 본사 가격표·프로모션 변경 시 결과가 달라질 수 있습니다.",
        "고객의 기존 렌탈 보유 여부, 카드 청구할인, 재렌탈 조건, 방문관리 옵션 변경은 별도 비교가 필요합니다.",
        "서비스프리 외 토탈/베이직/스페셜 옵션은 관리 비용과 혜택 구조가 달라 같은 표로 해석하면 안 됩니다.",
    ]:
        add_bullet(doc, text)


def audit_docx(path):
    with zipfile.ZipFile(path) as zf:
        names = set(zf.namelist())
        assert "word/document.xml" in names
        xml = zf.read("word/document.xml").decode("utf-8")
    required = [
        "5년 서비스프리",
        "매트리스+파운데이션",
        "전체 조합 상세표",
        "일시불 총액 - 5년 총렌탈료",
    ]
    missing = [s for s in required if s not in xml]
    if missing:
        raise AssertionError(f"Missing expected text: {missing}")
    if "TODO" in xml or "TBD" in xml:
        raise AssertionError("Placeholder text remains")


def main():
    data = load_product_data()
    rows = build_rows(data)
    if not rows:
        raise RuntimeError("No comparison rows found")
    summary = {
        "positive_count": sum(1 for r in rows if r["saving"] > 0),
        "avg_saving": sum(r["saving"] for r in rows) / len(rows),
    }
    doc = Document()
    set_document_styles(doc)
    add_title_page(doc, rows, summary)
    add_insights(doc, rows)
    add_full_table(doc, rows)
    add_customer_script(doc)
    OUT.parent.mkdir(exist_ok=True)
    doc.save(OUT)
    audit_docx(OUT)
    print(OUT)
    print(f"rows={len(rows)} positive={summary['positive_count']} avg_saving={summary['avg_saving']:.0f}")
    print(f"max_saving={max(rows, key=lambda r: r['saving'])['saving']:.0f}")
    print(f"min_saving={min(rows, key=lambda r: r['saving'])['saving']:.0f}")


if __name__ == "__main__":
    main()
