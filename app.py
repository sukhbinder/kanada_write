import eel
import numpy as np
import io
import json
from fill_in.deck_cards import Deck
import argparse
from pathlib import Path
import sys


deckapp = None

def get_webpath():
    web_path = Path(__file__).parent / "web"
    return str(web_path)


def selectwords(data):
    rdata = []
    for d in data:
        rdata.append([d.question, d.answer, d.num, d.active])
    return rdata

@eel.expose
def handle_exit(ar1,ar2):
    sys.exit(0)

@eel.expose
def get_words():
    ddata = deckapp.get_due_cards()
    print("{} words selected".format(len(ddata)))
    deckapp.ddata = ddata
    data = selectwords(ddata)
    a = io.StringIO()
    json.dump(data, a, separators=(',',':'))
    return a.getvalue()
    
@eel.expose
def save_words(deck):
    for a in deck:
        for d in deckapp.ddata:
            if a["sound"] == d.question:
                d.num = a["num"]
    deckapp.save_words(deckapp.ddata)
    return 1

def _launch_app(fname, mode="write"):
    global deckapp

    eel.init(get_webpath())
    fname = Path(fname).resolve()
    deckapp = Deck(fname)

    mode_val = "different.html"
    win_size = (620,550)
    if mode.lower() == "read":
        mode_val = "flipbook.html"
        win_size = (350, 500)
    try:
        eel.start(mode_val, size=win_size ,close_callback=handle_exit)
    except (SystemExit, MemoryError, KeyboardInterrupt):
        # We can do something here if needed
        # But if we don't catch these safely, the script will crash
        pass 
    print ('This is printed when the window is closed!')


def main():
    
    parser = argparse.ArgumentParser("Kanada Write App for Kids")
    parser.add_argument("word_file", type=str, help="File Path")
    parser.add_argument("-mode", type=str, choices=["read","write"], help="Read or write mode", default="write")

    args = parser.parse_args()

    _launch_app(args.word_file, args.mode)

    
if __name__ == "__main__":
    main()