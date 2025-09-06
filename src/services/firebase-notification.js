const admin = require("firebase-admin");
const serviceAccount = require("../config/firebase-service-account.json");

admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
});

// دالة لإرسال إشعار
async function sendNotification(deviceToken, title, body, data = {}) {
  const message = {
    token: deviceToken,
    notification: {
      title,
      body,
    },
    data, // بيانات إضافية يمكن أن يقرأها التطبيق
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
