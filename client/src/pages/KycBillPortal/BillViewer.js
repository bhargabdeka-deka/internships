// // src/pages/KycBillPortal/BillViewer.js
// import React from 'react';
// import './KycBillPortal.css';

// export default function BillViewer({ bills }) {
//   const handleAction = bill => {
//     if (bill.status === 'Unpaid') {
//       alert(`💰 Pay ₹${bill.amount} for ${bill.period}`);
//     } else {
//       alert(`📄 Viewing receipt for ${bill.period}`);
//     }
//   };

//   return (
//     <div className="bill-viewer">
//       <h3>My Bills</h3>

//       {bills.length === 0 ? (
//         <p className="no-bills">No bills available yet.</p>
//       ) : (
//         <table className="bill-table">
//           <thead>
//             <tr>
//               <th>Period</th>
//               <th>Units</th>
//               <th>Amount</th>
//               <th>Status</th>
//               <th>Action</th>
//             </tr>
//           </thead>
//           <tbody>
//             {bills.map(bill => (
//               <tr key={bill._id}>
//                 <td>{bill.period}</td>
//                 <td>{bill.units}</td>
//                 <td>₹{bill.amount}</td>
//                 <td>
//                   <span className={`badge ${bill.status.toLowerCase()}`}>
//                     {bill.status}
//                   </span>
//                 </td>
//                 <td>
//                   <button
//                     className="bill-action-button"
//                     onClick={() => handleAction(bill)}
//                   >
//                     {bill.status === 'Unpaid' ? '💰 Pay Now' : '📄 View Receipt'}
//                   </button>
//                 </td>
//               </tr>
//             ))}
//           </tbody>
//         </table>
//       )}
//     </div>
//   );
// }