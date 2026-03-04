const { test, expect } = require('@playwright/test');
const path = require('path');

test.describe('GenTab - Testy Funkcjonalne', () => {

  test.beforeEach(async ({ page }) => {
    await page.goto('file://' + path.resolve(__dirname, '../index.html'));
  });

  // ─── Podstawowe ───────────────────────────────────────────────────────────

  test('Powinien załadować stronę i mieć poprawny tytuł', async ({ page }) => {
    await expect(page).toHaveTitle(/GenTab/);
  });

  test('Sidebar powinien być widoczny i zawierać nazwę aplikacji', async ({ page }) => {
    await expect(page.locator('.sidebar-header-name')).toHaveText('GenTab');
    await expect(page.locator('.sidebar-header-version')).toHaveText('v0.2.0');
  });

  test('Przycisk GitHub powinien mieć poprawny link', async ({ page }) => {
    const ghBtn = page.locator('a.gh-btn');
    await expect(ghBtn).toBeVisible();
    await expect(ghBtn).toHaveAttribute('href', 'https://github.com/PPCFT/GenTab');
  });

  // ─── Formularz → synchronizacja z arkuszem ────────────────────────────────

  test('Wpisanie sygnatury powinno zaktualizować nagłówek arkusza', async ({ page }) => {
    await page.fill('#input-sygnatura', 'II K 123/24');
    // Nowy format: brak prefiksu "SYGNATURA: "
    await expect(page.locator('#display-sygnatura')).toHaveText('II K 123/24');
  });

  test('Wpisanie jednostki powinno zaktualizować nagłówek arkusza', async ({ page }) => {
    await page.fill('#input-jednostka', 'LK KWP w Krakowie');
    await expect(page.locator('#display-jednostka')).toHaveText('LK KWP w Krakowie');
  });

  test('Wpisanie numeru załącznika powinno zaktualizować arkusz', async ({ page }) => {
    await page.fill('#input-zalacznik', '5');
    await expect(page.locator('#display-zalacznik')).toHaveText('5');
  });

  test('Wybór daty powinien zaktualizować datę w stopce arkusza', async ({ page }) => {
    await page.fill('#input-data', '2026-03-04');
    // Nowy format: data w stopce "Wykonano w dniu..."
    await expect(page.locator('#display-data')).toHaveText('2026-03-04');
  });

  test('Zmiana typu dokumentu na Sprawozdanie powinna zmienić podpis', async ({ page }) => {
    await page.selectOption('#input-typ-dokumentu', 'sprawozdanie');
    await expect(page.locator('#display-podpis')).toContainText('Specjalisty');
    await expect(page.locator('#display-typ-dokumentu')).toHaveText('SPRAWOZDANIA');
  });

  // ─── Warianty (Faza 1) ────────────────────────────────────────────────────

  test('Powinien przełączyć na wariant W2 i dodać szczegół', async ({ page }) => {
    await page.selectOption('#layout-variant', 'w2');
    // Automatycznie tworzony jest pierwszy szczegół (1a)
    await expect(page.locator('#w2-controls')).toBeVisible();

    await page.click('button:has-text("Dodaj szczegół")');
    // Mamy już 2 szczegóły: 1a (auto) i 1b (kliknięcie)
    await expect(page.locator('.detail-selector')).toHaveCount(2);
    await expect(page.locator('.detail-zoom-block')).toHaveCount(2);
  });

  // ─── Panele (collapse/expand) ─────────────────────────────────────────────

  test('Kliknięcie nagłówka panelu powinno go zwinąć', async ({ page }) => {
    const toggle = page.locator('.panel-toggle').first();
    const body = page.locator('.panel-body').first();
    await expect(body).not.toHaveClass(/hidden-section/);
    await toggle.click();
    await expect(body).toHaveClass(/hidden-section/);
  });

  test('Ponowne kliknięcie nagłówka panelu powinno go rozwinąć', async ({ page }) => {
    const toggle = page.locator('.panel-toggle').first();
    const body = page.locator('.panel-body').first();
    await toggle.click(); // zwiń
    await toggle.click(); // rozwiń
    await expect(body).not.toHaveClass(/hidden-section/);
  });

  // ─── Suwaki ───────────────────────────────────────────────────────────────

  test('Suwak przybliżenia powinien aktualizować etykietę wartości', async ({ page }) => {
    await page.locator('#zoom-range').fill('8');
    await expect(page.locator('#zoom-val')).toHaveText('8.0x');
  });

  test('Suwak rozmiaru obrazu powinien aktualizować etykietę wartości', async ({ page }) => {
    await page.locator('#image-size-range').fill('60');
    await expect(page.locator('#image-size-val')).toHaveText('60%');
  });

  // ─── Korekcja ─────────────────────────────────────────────────────────────

  test('Reset korekcji powinien przywracać wartości domyślne', async ({ page }) => {
    await page.fill('#corr-brightness', '150');
    await page.fill('#corr-contrast', '130');
    await page.click('button:has-text("Reset")');
    await expect(page.locator('#corr-brightness-val')).toHaveText('100');
    await expect(page.locator('#corr-contrast-val')).toHaveText('100');
    await expect(page.locator('#corr-saturation-val')).toHaveText('100');
    await expect(page.locator('#corr-sharpen-val')).toHaveText('0.0');
  });

  // ─── Przyciski eksportu ───────────────────────────────────────────────────

  test('Przyciski eksportu powinny być widoczne i aktywne', async ({ page }) => {
    await expect(page.locator('button:has-text("Eksportuj do PDF")')).toBeVisible();
    await expect(page.locator('button:has-text("Zapisz powiększenie")')).toBeVisible();
    await expect(page.locator('button:has-text("Wyczyść arkusz")')).toBeVisible();
  });

});
