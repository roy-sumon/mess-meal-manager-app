import React from "react";
import jsPDF from "jspdf";
import html2canvas from "html2canvas";

const ViewMemberDetails = ({ members, byPassTotalBalance }) => {
  const generatePDF = () => {
    const input = document.getElementById("member-details");
    html2canvas(input, { scale: 2 }).then((canvas) => {
      const imgData = canvas.toDataURL("image/png");
      const pdf = new jsPDF();
      const imgWidth = 190;
      const pageHeight = pdf.internal.pageSize.height;
      const imgHeight = (canvas.height * imgWidth) / canvas.width;
      let heightLeft = imgHeight;

      let position = 0;

      pdf.addImage(imgData, "PNG", 10, position, imgWidth, imgHeight);
      heightLeft -= pageHeight;

      while (heightLeft >= 0) {
        position = heightLeft - imgHeight;
        pdf.addPage();
        pdf.addImage(imgData, "PNG", 10, position, imgWidth, imgHeight);
        heightLeft -= pageHeight;
      }

      pdf.save("member-details.pdf");
    });
  };

  return (
    <div className="mt-4">
      <h1 className="text-center text-lg underline">Member Details</h1>
      {members.length === 0 ? (
        <p className="text-center">No members added yet.</p>
      ) : (
        <>
          <div className="mt-4 text-lg font-bold text-center">
            Total Deposit Balance: {byPassTotalBalance.toFixed(2)} ৳
          </div>
          <button 
            onClick={generatePDF} 
            className="bg-blue-500 text-white px-4 py-2 rounded mt-4 mx-auto block"
          >
            Export to PDF
          </button>
          <div id="member-details" className="mt-2">
            <table className="min-w-full text-sm sm:md bg-white border border-gray-300 mt-2">
              <thead>
                <tr className="bg-rose-300">
                  <th className="border sm:px-4 sm:py-2">Name</th>
                  <th className="border sm:px-4 sm:py-2">Total Meals</th>
                  <th className="border sm:px-4 sm:py-2">Deposit Balance</th>
                  <th className="border sm:px-4 sm:py-2">Average Meal Rate</th>
                  <th className="border sm:px-4 sm:py-2">Existing Balance</th>
                </tr>
              </thead>
              <tbody className="[&>*:nth-child(even)]:bg-rose-100">
                {members.map((member, index) => (
                  <tr key={index}>
                    <td className="border sm:px-4 sm:py-2">{member.name}</td>
                    <td className="border px-3 sm:px-4 sm:py-2">{member.totalMeals}</td>
                    <td className="border sm:px-4 sm:py-2">{member.depositBalance.toFixed(2)} ৳</td>
                    <td className="border sm:px-4 sm:py-2">{member.averageMealRate.toFixed(2)} ৳</td>
                    <td className="border sm:px-4 sm:py-2">{member.individualAmount.toFixed(2)} ৳</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </>
      )}
    </div>
  );
};

export default ViewMemberDetails;