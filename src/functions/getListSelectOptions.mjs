const getListSelectOptions = async (selector, page) => {
  await page.waitForSelector(selector, { timeout: selector === "#ddlServicos" ? 15000 : 3000 });

  const options = await page.evaluate((selector) => {
    const selectElement = document.querySelector(selector);
    const optionElements = selectElement.querySelectorAll('option');
    const optionTexts = Array.from(optionElements).map(option => ({
      value: option.value,
      text: option.textContent
    }));
    return optionTexts;
  }, selector);

  return options;
}
export default getListSelectOptions