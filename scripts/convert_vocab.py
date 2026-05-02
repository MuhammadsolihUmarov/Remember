import sys
sys.stdout.reconfigure(encoding='utf-8')

import openpyxl
import time
from deep_translator import GoogleTranslator
from transliterate import translit

EXCEL_PATH = r"C:\Users\Muhammadsolih\AppData\Roaming\Claude\local-agent-mode-sessions\f877e0a7-8615-4887-91af-42f7ca7ccae7\4b00e0af-0c43-45c1-a80d-ba74a15053e9\local_db17f78b-d08c-41b2-bb60-763dfdce1f68\outputs\Russian_Uzbek_Vocabulary.xlsx"

SECTIONS = {
    "ГЛАГОЛ": {"prefix": "vb",   "type": "speaking", "level": "fundamental", "topic": "verbs"},
    "ИМЯ ПРИЛАГАТЕЛЬНОЕ": {"prefix": "adj",  "type": "speaking", "level": "b2",          "topic": "adjectives"},
    "ИМЯ СУЩЕСТВИТЕЛЬНОЕ": {"prefix": "noun", "type": "speaking", "level": "fundamental", "topic": "nouns"},
}

wb = openpyxl.load_workbook(EXCEL_PATH)
ws = wb.active

current_section = None
entries = []  # list of (section_key, russian_word)

for row in ws.iter_rows(values_only=True):
    a, b = row[0], row[1]
    # Section header is in column A, rest are None
    if a is not None and b is None:
        a_str = str(a).strip()
        for key in SECTIONS:
            if key in a_str:
                current_section = key
                break
        continue
    # Skip column header row
    if a == '#' or b == 'Russian / Русский':
        continue
    # Data rows: a=number, b=Russian
    if current_section and isinstance(a, int) and b:
        entries.append((current_section, str(b).strip()))

print(f"Total entries parsed: {len(entries)}")
counts = {}
for sec, _ in entries:
    counts[sec] = counts.get(sec, 0) + 1
for k, v in counts.items():
    print(f"  {k}: {v}")

# Translate in batches
translator = GoogleTranslator(source='ru', target='en')
BATCH_SIZE = 50
translated = []

for i in range(0, len(entries), BATCH_SIZE):
    batch = entries[i:i+BATCH_SIZE]
    russian_words = [e[1] for e in batch]
    joined = "\n".join(russian_words)
    try:
        result = translator.translate(joined)
        english_words = result.split("\n")
        while len(english_words) < len(russian_words):
            english_words.append("")
        for j, (sec, rus) in enumerate(batch):
            translated.append((sec, rus, english_words[j].strip()))
    except Exception as ex:
        print(f"Error at batch {i}: {ex}")
        for sec, rus in batch:
            translated.append((sec, rus, ""))
    time.sleep(0.4)
    print(f"Translated {min(i + BATCH_SIZE, len(entries))}/{len(entries)}", flush=True)

# Generate JS entries
counters = {k: 0 for k in SECTIONS}
js_lines = []

for sec, russian, english in translated:
    counters[sec] += 1
    cfg = SECTIONS[sec]
    card_id = f"{cfg['prefix']}_{counters[sec]}"

    try:
        translit_str = translit(russian, 'ru', reversed=True)
    except Exception:
        translit_str = russian

    russian_esc  = russian.replace('"', '\\"')
    english_esc  = english.replace('"', '\\"')
    translit_esc = translit_str.replace('"', '\\"')

    js_lines.append(
        f'  {{\n'
        f'    id: "{card_id}",\n'
        f'    type: "{cfg["type"]}",\n'
        f'    level: "{cfg["level"]}",\n'
        f'    topic: "{cfg["topic"]}",\n'
        f'    english: "{english_esc}",\n'
        f'    russian: "{russian_esc}",\n'
        f'    transliteration: "{translit_esc}",\n'
        f'  }},'
    )

output = "\n".join(js_lines)

with open("scripts/vocab_output.js", "w", encoding="utf-8") as f:
    f.write(output)

print(f"\nDone! {len(js_lines)} cards written to scripts/vocab_output.js")
for k, v in counters.items():
    print(f"  {k}: {v}")
