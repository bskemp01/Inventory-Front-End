import * as saveAs from 'file-saver';
import * as XLSX from 'xlsx';

const downloadToXLSX = (data: any[], fileName: string) => {
    const worksheet: XLSX.WorkSheet = XLSX.utils.json_to_sheet(data);
  const workbook: XLSX.WorkBook = { Sheets: { 'data': worksheet }, SheetNames: ['data'] };
  const excelBuffer: any = XLSX.write(workbook, { bookType: 'xlsx', type: 'array' });
  const report: Blob = new Blob([excelBuffer], {
    type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet;charset=UTF-8',
  });
  saveAs(report, `${fileName}.xlsx`);
  };

export { downloadToXLSX };
