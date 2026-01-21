# Sicherstellen, dass wir im richtigen Branch sind und diesen aktualisieren
BRANCH="laptop_version"

echo "Verwerfen von lokalen Änderungen"
git reset --hard

echo "Wechseln zum Branch $BRANCH"
git checkout $BRANCH

echo "Aktualisieren des Branches"
git pull origin $BRANCH

# Überprüfen, ob sich Abhängigkeiten geändert haben
echo "Überprüfen, ob npm install erforderlich ist"
if git diff --name-only HEAD@{1} | grep -qE "package(-lock)?\.json"; then
  echo "Änderungen in Abhängigkeiten erkannt, führe npm install aus"
  npm install
else
  echo "Keine Änderungen in Abhängigkeiten erkannt"
fi

echo "Starten des Prozesses"
echo start