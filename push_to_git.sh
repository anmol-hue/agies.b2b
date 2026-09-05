#!/bin/bash
cd "C:\Users\anshu\Downloads\tpis.agies"
git init
git remote add origin https://github.com/anmol-hue/agies.b2b.git || git remote set-url origin https://github.com/anmol-hue/agies.b2b.git
git add .
git commit -m "Implement proprietary Clinical Signature Matching Engine (CSME)"
git branch -M main
git push -u origin main
