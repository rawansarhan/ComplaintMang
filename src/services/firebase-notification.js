const admin = require("firebase-admin");
require("dotenv").config();

const serviceAccount = JSON.parse(process.env.FIREBASE_SERVICE_ACCOUNT);

admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
});

async function sendNotification(deviceToken, title, body, data = {}) {
  const message = {
    token: deviceToken,
    notification: { title, body },
    data, 
  };

  try {
    const response = await admin.messaging().send(message);
    console.log("✅ تم إرسال الإشعار:", response);
    return true;
  } catch (error) {
    console.error("❌ خطأ في الإرسال:", error);
    return false;
  }
}

module.exports = { sendNotification };
