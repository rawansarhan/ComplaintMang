// const admin = require("firebase-admin");
// const serviceAccount = require("../config/firebase-service-account.json");

// admin.initializeApp({
//   credential: admin.credential.cert(serviceAccount),
// });

// // دالة لإرسال إشعار
// async function sendNotification(deviceToken, title, body, data = {}) {
//   const message = {
//     token: deviceToken,
//     notification: { title, body },
//     data, // بيانات إضافية يمكن أن يقرأها التطبيق
//   };

//   try {
//     const response = await admin.messaging().send(message);
//     console.log("✅ تم إرسال الإشعار بنجاح:", response);
//     return true;
//   } catch (error) {
//     // طباعة كل التفاصيل الممكنة للخطأ
//     console.error("❌ خطأ في إرسال الإشعار:");
//     console.error("Code:", error.code);
//     console.error("Message:", error.message);
//     if (error.details) console.error("Details:", error.details);

//     return false;
//   }
// }

// module.exports = { sendNotification };
