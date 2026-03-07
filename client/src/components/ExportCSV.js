import React from 'react';

class ExportCSV extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      successMessage: '',
      errorMessage: ''
    };
  }

  exportToCSV = () => {
    const confirmed = window.confirm('Are you sure you want to export to CSV?');
    if (!confirmed) {
      this.setState({ errorMessage: 'Export canceled' });
      setTimeout(() => {
        this.setState({ errorMessage: '' });
      }, 3000);
      return;
    }

    fetch('/export-csv')
      .then(response => {
        if (!response.ok) {
          throw new Error('Network response was not ok');
        }
        return response.text();
      })
      .then(csvData => {

        const fixedHeaders = 'Id,Name,Date_Of_Reg.,Email_ID,Age,Gender,Mobile_Number,State,District,Address\n';
        let modifiedCsvData = csvData.replace(/^(.*?),(.*?),(.*?),(.*?),(.*?),(.*?),(.*?),(.*?),(.*?),(.*)$/gm, (_, g1, g2, g3, g4, g5, g6, g7, g8, g9, g10) => {
          const address = g10.replace(/"/g, '""'); 
          return `${g1},${g2},${g3},${g4},${g5},${g6},${g7},${g8},${g9},"${address}"`;
        });

        const csvContent = fixedHeaders + modifiedCsvData;

        const blob = new Blob([csvContent], { type: 'text/csv' });
        const url = window.URL.createObjectURL(blob);

        const link = document.createElement('a');
        link.href = url;
        link.setAttribute('download', 'data.csv');
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
        window.URL.revokeObjectURL(url);

        this.setState({ successMessage: 'File downloaded successfully' });
        setTimeout(() => {
          this.setState({ successMessage: '' });
        }, 3000);
      })
      .catch(error => {
        console.error('Error exporting to CSV: ', error);
        this.setState({ errorMessage: 'Export failed' });
        setTimeout(() => {
          this.setState({ errorMessage: '' });
        }, 3000);
      });
  }

  render() {
    return (
      <div>
        {this.state.successMessage && <div style={{ color: 'green' }}>{this.state.successMessage}</div>}
        {this.state.errorMessage && <div style={{ color: 'red' }}>{this.state.errorMessage}</div>}
        <button 
          type="button" 
          className="export_btn btn btn-primary"  
          style={{ backgroundColor: 'green' , borderRadius:'45px', borderColor:'red'}} 
          onClick={this.exportToCSV}
        >
          Export to CSV
        </button>
      </div>
    );
  }
}

export default ExportCSV;
