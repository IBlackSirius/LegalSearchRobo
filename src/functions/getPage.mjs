async function getPage(context) {
  const URL_REGISTRADORES = 'https://registradores.onr.org.br/ConsultaTaxas/frmConsultaTaxas.aspx'
  try {
    let page = await context.newPage();
    await page.goto(URL_REGISTRADORES);
    return { page }
    
  } catch (error) {
    return await getPage(context)
  }

}
export default getPage