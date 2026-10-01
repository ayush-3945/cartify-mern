// Utility to generate and download a professional order invoice as PDF
export const downloadInvoice = (order) => {
  if (!order) return;

  const invoiceDate = new Date(order.createdAt || Date.now()).toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric'
  });

  const address = order.address || {};
  const items = order.item || [];
  const orderId = order._id || 'ORD-' + Math.random().toString(36).substr(2, 9).toUpperCase();
  const subtotal = items.reduce((acc, item) => (item.product?.price || 0) * (item.quantity || 1) + acc, 0);
  const discount = order.discount || 0;
  const grandTotal = order.total || (subtotal + 5.55 + 5);

  const itemsHtml = items.map((it, idx) => `
    <tr>
      <td style="padding: 10px; border-bottom: 1px solid #eee;">${idx + 1}</td>
      <td style="padding: 10px; border-bottom: 1px solid #eee;">
        <strong>${it.product?.title || 'Product'}</strong>
        <div style="font-size: 11px; color: #777;">ID: ${it.product?._id || ''}</div>
      </td>
      <td style="padding: 10px; border-bottom: 1px solid #eee; text-align: center;">${it.quantity || 1}</td>
      <td style="padding: 10px; border-bottom: 1px solid #eee; text-align: right;">$${(it.product?.price || 0).toFixed(2)}</td>
      <td style="padding: 10px; border-bottom: 1px solid #eee; text-align: right;">$${((it.product?.price || 0) * (it.quantity || 1)).toFixed(2)}</td>
    </tr>
  `).join('');

  const printWindow = window.open('', '_blank');
  if (!printWindow) {
    alert('Please allow popups to download your invoice.');
    return;
  }

  printWindow.document.write(`
    <!DOCTYPE html>
    <html>
      <head>
        <title>Invoice - ${orderId}</title>
        <style>
          body { font-family: 'Helvetica Neue', Helvetica, Arial, sans-serif; color: #333; margin: 0; padding: 25px; }
          .invoice-box { max-width: 800px; margin: auto; padding: 30px; border: 1px solid #eee; box-shadow: 0 0 10px rgba(0, 0, 0, 0.05); border-radius: 8px; }
          .header { display: flex; justify-content: space-between; align-items: center; border-bottom: 2px solid #000; padding-bottom: 15px; }
          .brand { font-size: 26px; font-weight: 800; letter-spacing: 1px; }
          .brand span { color: #e53935; }
          .invoice-title { font-size: 20px; font-weight: 700; color: #555; text-align: right; }
          .details-row { display: flex; justify-content: space-between; margin: 25px 0; }
          .details-col { width: 48%; }
          .table { width: 100%; border-collapse: collapse; margin-top: 15px; }
          .table th { background: #f8f9fa; padding: 12px 10px; text-align: left; font-size: 13px; border-bottom: 2px solid #ddd; }
          .summary { margin-top: 25px; margin-left: auto; width: 300px; }
          .summary-row { display: flex; justify-content: space-between; padding: 6px 0; font-size: 14px; }
          .total-row { border-top: 2px solid #000; font-size: 18px; font-weight: 700; padding-top: 10px; color: #000; }
          .footer { margin-top: 40px; padding-top: 15px; border-top: 1px solid #eee; text-align: center; font-size: 12px; color: #888; }
          .btn-print { background: #000; color: #fff; padding: 10px 20px; border: none; border-radius: 4px; cursor: pointer; font-size: 14px; margin-bottom: 15px; }
          @media print { .btn-print { display: none; } body { padding: 0; } .invoice-box { border: none; box-shadow: none; } }
        </style>
      </head>
      <body>
        <div style="text-align: right; max-width: 800px; margin: auto;">
          <button class="btn-print" onclick="window.print()">🖨️ Print / Save as PDF</button>
        </div>
        <div class="invoice-box">
          <div class="header">
            <div>
              <div class="brand">CARTIFY<span>.</span></div>
              <div style="font-size: 12px; color: #666; margin-top: 4px;">Premium E-Commerce Platform</div>
            </div>
            <div>
              <div class="invoice-title">TAX INVOICE</div>
              <div style="font-size: 13px; color: #777;">#${orderId.slice(-8).toUpperCase()}</div>
              <div style="font-size: 12px; color: #777;">Date: ${invoiceDate}</div>
            </div>
          </div>

          <div class="details-row">
            <div class="details-col">
              <strong style="font-size: 14px;">Billed & Shipped To:</strong>
              <div style="margin-top: 5px; font-size: 13px; line-height: 1.5;">
                <strong>${address.type || 'Home'}</strong><br/>
                ${address.street || 'Standard Delivery'}<br/>
                ${address.city || ''}, ${address.state || ''} ${address.postalCode || ''}<br/>
                Phone: ${address.phoneNumber || 'N/A'}
              </div>
            </div>
            <div class="details-col" style="text-align: right;">
              <strong style="font-size: 14px;">Order Info:</strong>
              <div style="margin-top: 5px; font-size: 13px; line-height: 1.5;">
                Payment Method: <strong>${order.paymentMode || 'COD'}</strong><br/>
                Status: <strong style="color: #2e7d32;">${order.status || 'Confirmed'}</strong><br/>
                Payment Status: <strong>${order.paymentMode === 'CARD' ? 'Paid' : 'Due on Delivery'}</strong>
              </div>
            </div>
          </div>

          <table class="table">
            <thead>
              <tr>
                <th style="width: 5%;">#</th>
                <th style="width: 50%;">Item Description</th>
                <th style="width: 15%; text-align: center;">Qty</th>
                <th style="width: 15%; text-align: right;">Price</th>
                <th style="width: 15%; text-align: right;">Total</th>
              </tr>
            </thead>
            <tbody>
              ${itemsHtml}
            </tbody>
          </table>

          <div class="summary">
            <div class="summary-row">
              <span>Subtotal:</span>
              <span>$${subtotal.toFixed(2)}</span>
            </div>
            ${discount > 0 ? `
              <div class="summary-row" style="color: #2e7d32;">
                <span>Discount Applied:</span>
                <span>-$${discount.toFixed(2)}</span>
              </div>
            ` : ''}
            <div class="summary-row">
              <span>Estimated Shipping:</span>
              <span>$5.55</span>
            </div>
            <div class="summary-row">
              <span>Taxes:</span>
              <span>$5.00</span>
            </div>
            <div class="summary-row total-row">
              <span>Grand Total:</span>
              <span>$${grandTotal.toFixed(2)}</span>
            </div>
          </div>

          <div class="footer">
            <p>Thank you for shopping with <strong>Cartify</strong>! For customer assistance, contact support@cartify.com</p>
            <p>This is a computer-generated invoice and does not require a physical signature.</p>
          </div>
        </div>
        <script>
          window.onload = function() {
            setTimeout(function() { window.print(); }, 400);
          }
        </script>
      </body>
    </html>
  `);
  printWindow.document.close();
};
