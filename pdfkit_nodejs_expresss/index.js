const pdfkit = require('pdfkit')
const fs =require('fs')
const pdfdoc = new pdfkit 


pdfdoc.pipe(fs.createWriteStream("output.pdf"))

pdfdoc.image('image.png',{

    fit:[250,300],
    align : 'center',
    valign:'center'
});

pdfdoc.text("hello word")
.fontSize(25)