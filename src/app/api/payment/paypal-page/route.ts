import { NextRequest, NextResponse } from "next/server"

export async function POST(request: NextRequest) {
  try {
    const { productId, customerEmail, amount, itemName } = await request.json()
    
    // إنشاء صفحة وسيطة تُرسل المستخدم لـ PayPal بطريقة مختلفة
    const htmlTemplate = [
      '<!DOCTYPE html>',
      '<' + 'html dir="rtl" lang="ar">',
      '<head>',
      '    <meta charset="UTF-8">',
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>تحويل إلى PayPal - المتجر الرقمي</title>
    <style>
        body {
            font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
            background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
            display: flex;
            justify-content: center;
            align-items: center;
            min-height: 100vh;
            margin: 0;
            color: white;
        }
        .container {
            background: rgba(255, 255, 255, 0.1);
            padding: 40px;
            border-radius: 20px;
            backdrop-filter: blur(10px);
            text-align: center;
            box-shadow: 0 8px 32px rgba(31, 38, 135, 0.37);
            border: 1px solid rgba(255, 255, 255, 0.18);
            max-width: 500px;
        }
        .spinner {
            border: 4px solid rgba(255, 255, 255, 0.3);
            border-radius: 50%;
            border-top: 4px solid white;
            width: 50px;
            height: 50px;
            animation: spin 1s linear infinite;
            margin: 20px auto;
        }
        @keyframes spin {
            0% { transform: rotate(0deg); }
            100% { transform: rotate(360deg); }
        }
        .btn {
            background: #0070ba;
            color: white;
            border: none;
            padding: 15px 30px;
            border-radius: 8px;
            font-size: 16px;
            cursor: pointer;
            margin: 10px;
            transition: all 0.3s ease;
        }
        .btn:hover {
            background: #005ea6;
            transform: translateY(-2px);
        }
        .manual-link {
            background: rgba(255, 255, 255, 0.2);
            padding: 20px;
            border-radius: 10px;
            margin-top: 20px;
        }
        .link-text {
            word-break: break-all;
            background: rgba(0, 0, 0, 0.3);
            padding: 10px;
            border-radius: 5px;
            font-family: monospace;
            font-size: 12px;
        }
    </style>
</head>
<body>
    <div class="container">
        <h2>🔄 جارٍ التحويل إلى PayPal</h2>
        <div class="spinner"></div>
        <p>يتم الآن إعدادك للدفع الآمن...</p>
        
        <div id="autoRedirect">
            <p>إذا لم يتم التحويل تلقائياً خلال 5 ثوانٍ:</p>
            <button class="btn" onclick="redirectToPaypal()">اضغط هنا للذهاب إلى PayPal</button>
        </div>
        
        <div class="manual-link">
            <h3>أو انسخ هذا الرابط واذهب إليه مباشرة:</h3>
            <div class="link-text" id="paypalLink"></div>
            <button class="btn" onclick="copyLink()">📋 نسخ الرابط</button>
        </div>
        
        <div style="margin-top: 20px; font-size: 12px; opacity: 0.8;">
            💡 نصيحة: إذا ظهرت مشكلة، جرب متصفح آخر أو امسح الكوكيز
        </div>
    </div>

    <form id="paypalForm" method="POST" action="https://www.paypal.com/cgi-bin/webscr" style="display: none;">
        <input type="hidden" name="cmd" value="_xclick">
        <input type="hidden" name="business" value="doodooalmahdi@gmail.com">
        <input type="hidden" name="item_name" value="${itemName || 'Digital Product'}">
        <input type="hidden" name="item_number" value="${productId}">
        <input type="hidden" name="amount" value="${amount}">
        <input type="hidden" name="currency_code" value="USD">
        <input type="hidden" name="return" value="${process.env.NEXTAUTH_URL}/order-confirmation?product=${productId}&email=${customerEmail}&payment=paypal">
        <input type="hidden" name="cancel_return" value="${process.env.NEXTAUTH_URL}/checkout?product=${productId}">
        <input type="hidden" name="notify_url" value="${process.env.NEXTAUTH_URL}/api/payment/paypal-webhook">
        <input type="hidden" name="no_shipping" value="1">
        <input type="hidden" name="no_note" value="1">
        <input type="hidden" name="charset" value="utf-8">
        <input type="hidden" name="rm" value="2">
        <input type="hidden" name="custom" value="${productId}">
        <input type="hidden" name="bn" value="PP-BuyNowBF">
        <input type="hidden" name="lc" value="US">
    </form>

    <script>
        // إنشاء رابط PayPal يدوي
        const params = new URLSearchParams({
            cmd: '_xclick',
            business: 'doodooalmahdi@gmail.com',
            item_name: '${itemName || 'Digital Product'}',
            item_number: '${productId}',
            amount: '${amount}',
            currency_code: 'USD',
            return: '${process.env.NEXTAUTH_URL}/order-confirmation?product=${productId}&email=${customerEmail}&payment=paypal',
            cancel_return: '${process.env.NEXTAUTH_URL}/checkout?product=${productId}',
            no_shipping: '1',
            no_note: '1',
            charset: 'utf-8',
            rm: '2',
            custom: '${productId}',
            bn: 'PP-BuyNowBF',
            lc: 'US'
        });
        
        const paypalUrl = 'https://www.paypal.com/cgi-bin/webscr?' + params.toString();
        document.getElementById('paypalLink').textContent = paypalUrl;

        function redirectToPaypal() {
            // جرب الطريقة الأولى
            try {
                document.getElementById('paypalForm').submit();
            } catch (e) {
                // إذا فشلت، استخدم window.location
                window.location.href = paypalUrl;
            }
        }

        function copyLink() {
            navigator.clipboard.writeText(paypalUrl).then(() => {
                alert('تم نسخ الرابط! الصقه في متصفح جديد.');
            });
        }

        // محاولة التحويل التلقائي بعد 3 ثوانٍ
        setTimeout(() => {
            redirectToPaypal();
        }, 3000);
    </script>
</body>
</html>`;

    return new NextResponse(html, {
      headers: {
        'Content-Type': 'text/html; charset=utf-8',
      },
    })
    
  } catch (error) {
    console.error('PayPal intermediate page error:', error)
    return NextResponse.json(
      { error: 'Failed to create PayPal payment page' },
      { status: 500 }
    )
  }
}