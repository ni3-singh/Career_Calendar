.PHONY: setup test clean

PYTHON ?= python3
VENV := .venv
BIN := $(VENV)/bin

setup: $(BIN)/pytest

$(BIN)/pytest: requirements.txt
	$(PYTHON) -m venv $(VENV)
	$(BIN)/python -m pip install --upgrade pip
	$(BIN)/python -m pip install -r requirements.txt
	@touch $(BIN)/pytest

test: setup
	$(BIN)/python -m pytest

clean:
	rm -rf $(VENV) .pytest_cache test.db
