# Dr. Malek Al-Romaimah Android App & Wallpaper Studio 📱

مشروع تطبيق أندرويد متكامل ومنصة ويب لتوليد الخلفيات والوسائط الذكية وفق تصميم ومخطط الدكتور / مالك الرميمة.

---

## 🌟 نظرة عامة على المشروع (Project Overview)

يحتوي هذا المستودع على:
1. **تطبيق الويب والتوليد الذكي (Web Studio)**: تطبيق متكامل مبني بـ React 19 + TypeScript + Express ومزود بنماذج الذكاء الاصطناعي لتوليد خلفيات الهواتف بنسبة `9:16` وميزات الريمكس (Remix) وتصدير الصور بدقات (1K, 2K, 4K).
2. **ملفات مشروع أندرويد الكامل (Android Kotlin Project)**: كود تطبيقي كامل مكتوب بلغة Kotlin مع واجهات تفاعلية تدعم الأقسام السبعة وشريط البحث المتقدم.
3. **سير عمل البناء التلقائي (GitHub Actions Workflow)**: ملف CI/CD جاهز يقوم ببناء ملف التثبيت `app-debug.apk` تلقائياً عند الدفع (Push) ورفعه إلى تبويب Artifacts في GitHub.

---

## 📱 الأقسام الرئيسية في واجهة التطبيق (UI Structure)

- **شريط البحث العلوي (Google Search Bar)**: مستطيل بحث عريض مرتبط بمتصفح جوجل وCustom Tabs.
- **1. مقاطع ريلز (Reels)**: بطاقة تفاعلية لعرض الفيديوهات القصيرة من الويب.
- **2. فيديوهات جديدة (New Videos)**: واجهة لمشاهدة أحدث الفيديوهات عبر مشغلات الفيديو والويب.
- **3. الأصدقاء (Friends & Social)**: روابط وتكامل المشاركة الاجتماعية (Facebook, Twitter/X, TikTok).
- **4. المنشورات (Posts & Feed)**: تغذية إخبارية ومنشورات يومية متجددة.
- **5. المجموعات (Groups)**: وصول مباشر للمجموعات النشطة.
- **6. المسلسلات (Series)**: قوائم تشغيل لعرض المسلسلات والمحتوى المرئي.
- **7. الألعاب (Games)**: شريط عريض يفتح منصات ألعاب HTML5 الخفيفة وألعاب الويب.
- **التوقيع السفلي (Footer Signature)**:
  - **تصميم وبرمجة الدكتور / مالك الرميمة**
  - **رقم الهاتف / واتساب**: `771134103`

---

## ⚙️ ملفات مشروع أندرويد (Android Code Structure)

### 1. `AndroidManifest.xml`
```xml
<?xml version="1.0" encoding="utf-8"?>
<manifest xmlns:android="http://schemas.android.com/apk/res/android"
    package="com.drmalek.app">

    <uses-permission android:name="android.permission.INTERNET" />
    <uses-permission android:name="android.permission.ACCESS_NETWORK_STATE" />

    <application
        android:allowBackup="true"
        android:icon="@mipmap/ic_launcher"
        android:label="Dr. Malek App"
        android:roundIcon="@mipmap/ic_launcher_round"
        android:supportsRtl="true"
        android:theme="@style/Theme.Material3.Dark.NoActionBar">
        <activity
            android:name=".MainActivity"
            android:exported="true">
            <intent-filter>
                <action android:name="android.intent.action.MAIN" />
                <category android:name="android.intent.category.LAUNCHER" />
            </intent-filter>
        </activity>
    </application>
</manifest>
```

### 2. `MainActivity.kt`
```kotlin
package com.drmalek.app

import android.content.Intent
import android.net.Uri
import android.os.Bundle
import androidx.activity.ComponentActivity
import androidx.activity.compose.setContent
import androidx.compose.foundation.background
import androidx.compose.foundation.clickable
import androidx.compose.foundation.layout.*
import androidx.compose.foundation.shape.RoundedCornerShape
import androidx.compose.material3.*
import androidx.compose.runtime.*
import androidx.compose.ui.Alignment
import androidx.compose.ui.Modifier
import androidx.compose.ui.draw.clip
import androidx.compose.ui.graphics.Color
import androidx.compose.ui.unit.dp
import androidx.compose.ui.unit.sp

class MainActivity : ComponentActivity() {
    override fun onCreate(savedInstanceState: Bundle?) {
        super.onCreate(savedInstanceState)
        setContent {
            DrMalekMainScreen(
                onOpenUrl = { url ->
                    val intent = Intent(Intent.ACTION_VIEW, Uri.parse(url))
                    startActivity(intent)
                },
                onContactWhatsApp = {
                    val url = "https://wa.me/967771134103"
                    startActivity(Intent(Intent.ACTION_VIEW, Uri.parse(url)))
                }
            )
        }
    }
}

@Composable
fun DrMalekMainScreen(onOpenUrl: (String) -> Unit, onContactWhatsApp: () -> Unit) {
    Surface(
        modifier = Modifier.fillMaxSize(),
        color = Color(0xFF09090B)
    ) {
        Column(
            modifier = Modifier
                .fillMaxSize()
                .padding(16.dp),
            verticalArrangement = Arrangement.SpaceBetween
        ) {
            // 1. Google Search Bar
            Box(
                modifier = Modifier
                    .fillMaxWidth()
                    .height(54.dp)
                    .clip(RoundedCornerShape(27.dp))
                    .background(Color.White)
                    .clickable { onOpenUrl("https://www.google.com") }
                    .padding(horizontal = 16.dp),
                contentAlignment = Alignment.CenterStart
            ) {
                Text(
                    text = "بحث في جوجل...",
                    color = Color.Gray,
                    fontSize = 16.sp
                )
            }

            Spacer(modifier = Modifier.height(12.dp))

            // 2. Main 7 Sections Grid
            Column(
                modifier = Modifier.weight(1f),
                verticalArrangement = Arrangement.spacedBy(10.dp)
            ) {
                // Row 1 (Reels, Videos, Friends)
                Row(
                    modifier = Modifier.fillMaxWidth(),
                    horizontalArrangement = Arrangement.spacedBy(8.dp)
                ) {
                    AppCard("مقاطع ريلز (1)", Modifier.weight(1f)) { onOpenUrl("https://www.youtube.com/shorts") }
                    AppCard("فيديوهات جديدة (2)", Modifier.weight(1f)) { onOpenUrl("https://www.youtube.com") }
                    AppCard("الأصدقاء (3)", Modifier.weight(1f)) { onOpenUrl("https://www.facebook.com") }
                }

                // Row 2 (Posts, Groups, Series)
                Row(
                    modifier = Modifier.fillMaxWidth(),
                    horizontalArrangement = Arrangement.spacedBy(8.dp)
                ) {
                    AppCard("المنشورات (4)", Modifier.weight(1f)) { onOpenUrl("https://twitter.com") }
                    AppCard("المجموعات (5)", Modifier.weight(1f)) { onOpenUrl("https://t.me") }
                    AppCard("المسلسلات (6)", Modifier.weight(1f)) { onOpenUrl("https://www.youtube.com/results?search_query=series") }
                }

                // Row 3 (Games - Full Width)
                AppCard("الألعاب (7)", Modifier.fillMaxWidth().height(90.dp)) {
                    onOpenUrl("https://poki.com")
                }
            }

            // 3. Footer
            Card(
                modifier = Modifier
                    .fillMaxWidth()
                    .clickable { onContactWhatsApp() },
                colors = CardDefaults.cardColors(containerColor = Color(0xFF18181B)),
                shape = RoundedCornerShape(16.dp)
            ) {
                Column(
                    modifier = Modifier.padding(12.dp),
                    horizontalAlignment = Alignment.CenterHorizontally
                ) {
                    Text(
                        text = "تصميم وبرمجة الدكتور / مالك الرميمة",
                        color = Color.White,
                        fontSize = 14.sp
                    )
                    Text(
                        text = "رقم هاتف / واتساب: 771134103",
                        color = Color(0xFF4ADE80),
                        fontSize = 13.sp
                    )
                }
            }
        }
    }
}

@Composable
fun AppCard(title: String, modifier: Modifier = Modifier, onClick: () -> Unit) {
    Card(
        modifier = modifier
            .height(84.dp)
            .clickable { onClick() },
        shape = RoundedCornerShape(14.dp),
        colors = CardDefaults.cardColors(containerColor = Color(0xFF27272A))
    ) {
        Box(
            modifier = Modifier.fillMaxSize(),
            contentAlignment = Alignment.Center
        ) {
            Text(
                text = title,
                color = Color.White,
                fontSize = 12.sp
            )
        }
    }
}
```

---

## 🚀 خطة البناء التلقائي عبر GitHub Actions

تم وضع ملف البناء داخل المسار: `.github/workflows/build.yml`

### خطوات الحصول على تطبيقك (APK) على هاتفك:
1. ارفع الكود إلى مستودع GitHub الخاص بك (`git push origin main`).
2. سيقوم GitHub Actions بتشغيل عملية البناء تلقائياً (`Build Android APK`).
3. عند انتهاء البناء وظهور علامة الصح الخضراء ✅، اضغط على تبويب **Actions** ثم اختر آخر تشغيل، وستجد ملف الـ APK جاهزاً للتحميل في قسم **Artifacts**.
4. انقل ملف `App-Debug-APK.zip` إلى هاتفك وقم بتثبيته مباشرة.
