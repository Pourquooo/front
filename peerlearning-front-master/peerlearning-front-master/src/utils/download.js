import * as XLSX from 'xlsx'
export function downloadXlsx(dataList, fileName){
    // 字符串转成字节流
    const stringToBuff = str => {
        var buf = new ArrayBuffer(str.length);
        var view = new Uint8Array(buf);
        for (var i = 0; i != str.length; ++i) {
            view[i] = str.charCodeAt(i) & 0xff
        }
        return buf;
    }
    // 初始化Excel表格
    console.log(XLSX);
    let workbook = XLSX.utils.book_new();
    let worksheet = XLSX.utils.aoa_to_sheet(dataList);
    XLSX.utils.book_append_sheet(workbook, worksheet, 'sheet1');

    // 字节流转成二进制
    let xlsxBlob = new Blob([stringToBuff(XLSX.write(workbook, { bookType: 'xlsx', bookSST: false, type: 'binary' }))], { type: '' })

    const a = document.createElement('a');
    a.href = URL.createObjectURL(xlsxBlob);
    a.download = fileName;
    a.click()
}
