import openpyxl
import sys
sys.stdout.reconfigure(encoding='utf-8')

EXCEL_PATH = r"C:\Users\Muhammadsolih\AppData\Roaming\Claude\local-agent-mode-sessions\f877e0a7-8615-4887-91af-42f7ca7ccae7\4b00e0af-0c43-45c1-a80d-ba74a15053e9\local_db17f78b-d08c-41b2-bb60-763dfdce1f68\outputs\Russian_Uzbek_Vocabulary.xlsx"

wb = openpyxl.load_workbook(EXCEL_PATH)
ws = wb.active

rows_data = []
for i, row in enumerate(ws.iter_rows(values_only=True)):
    rows_data.append(f"Row {i}: {repr(row)}")

with open("scripts/debug_out.txt", "w", encoding="utf-8") as f:
    f.write("\n".join(rows_data[:30]))

print("Written to scripts/debug_out.txt")
