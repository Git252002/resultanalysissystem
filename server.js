const express = require('express');
const app = express();
const puppeteer = require('puppeteer');

app.use(express.static('public'));
app.use(express.urlencoded({ extended: true }));
app.set('view engine', 'ejs');

app.get('/', (req, res) => {
  res.render('index');
});

app.post('/convert', async (req, res) => {
  const { url } = req.body;

  try {
    const pdfPath = `public/result.pdf`;

    const browser = await puppeteer.launch(
      { 
      
        headless : false,
        slowMo:true,
        args : ["--start-maximized"],
        defaultViewport : null}
    );
    const page = await browser.newPage();
    await page.goto(url, { waitUntil: 'networkidle0' });
    await page.pdf({ path: pdfPath, format: 'A4', printBackground: true });
    await browser.close();

    res.download(pdfPath);
  } catch (error) {
    console.error(error);
    res.status(500).send('Error converting to PDF');
  }
});

app.listen(3000, () => {
  console.log('Server is running on http://localhost:3000');
});
