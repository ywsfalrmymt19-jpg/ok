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
                    try {
                        val intent = Intent(Intent.ACTION_VIEW, Uri.parse(url))
                        startActivity(intent)
                    } catch (e: Exception) {
                        e.printStackTrace()
                    }
                },
                onContactWhatsApp = {
                    try {
                        val url = "https://wa.me/967771134103"
                        startActivity(Intent(Intent.ACTION_VIEW, Uri.parse(url)))
                    } catch (e: Exception) {
                        e.printStackTrace()
                    }
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
                    text = "محرك جوجل للبحث...",
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
                    AppCard("الأصدقاء + ريلز (3)", Modifier.weight(1f)) { onOpenUrl("https://www.facebook.com") }
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
                AppCard("الألعاب (7) - منصات ألعاب الويب الخفيفة", Modifier.fillMaxWidth().height(90.dp)) {
                    onOpenUrl("https://poki.com")
                }
            }

            // 3. Footer Signature
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
