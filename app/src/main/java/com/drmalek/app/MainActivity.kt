package com.drmalek.app

import android.content.Intent
import android.net.Uri
import android.os.Bundle
import androidx.activity.ComponentActivity
import androidx.activity.compose.setContent
import androidx.compose.foundation.background
import androidx.compose.foundation.clickable
import androidx.compose.foundation.layout.Arrangement
import androidx.compose.foundation.layout.Box
import androidx.compose.foundation.layout.Column
import androidx.compose.foundation.layout.Row
import androidx.compose.foundation.layout.Spacer
import androidx.compose.foundation.layout.fillMaxSize
import androidx.compose.foundation.layout.fillMaxWidth
import androidx.compose.foundation.layout.height
import androidx.compose.foundation.layout.padding
import androidx.compose.foundation.shape.RoundedCornerShape
import androidx.compose.material3.Card
import androidx.compose.material3.CardDefaults
import androidx.compose.material3.Surface
import androidx.compose.material3.Text
import androidx.compose.runtime.Composable
import androidx.compose.ui.Alignment
import androidx.compose.ui.Modifier
import androidx.compose.ui.draw.clip
import androidx.compose.ui.graphics.Color
import androidx.compose.ui.text.font.FontWeight
import androidx.compose.ui.text.style.TextAlign
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
                    } catch (_: Exception) {
                    }
                },
                onContactWhatsApp = {
                    try {
                        val url = "https://wa.me/967771134103"
                        startActivity(Intent(Intent.ACTION_VIEW, Uri.parse(url)))
                    } catch (_: Exception) {
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
                    .height(52.dp)
                    .clip(RoundedCornerShape(26.dp))
                    .background(Color.White)
                    .clickable { onOpenUrl("https://www.google.com") }
                    .padding(horizontal = 20.dp),
                contentAlignment = Alignment.CenterStart
            ) {
                Text(
                    text = "محرك جوجل للبحث...",
                    color = Color.DarkGray,
                    fontSize = 15.sp
                )
            }

            Spacer(modifier = Modifier.height(12.dp))

            // 2. Main 7 Sections
            Column(
                modifier = Modifier.weight(1f),
                verticalArrangement = Arrangement.spacedBy(10.dp)
            ) {
                // Row 1 (Reels, Videos, Friends)
                Row(
                    modifier = Modifier.fillMaxWidth(),
                    horizontalArrangement = Arrangement.spacedBy(8.dp)
                ) {
                    AppCard("مقاطع ريلز (1)", Modifier.weight(1f), 80) { onOpenUrl("https://www.youtube.com/shorts") }
                    AppCard("فيديوهات جديدة (2)", Modifier.weight(1f), 80) { onOpenUrl("https://www.youtube.com") }
                    AppCard("الأصدقاء + ريلز (3)", Modifier.weight(1f), 80) { onOpenUrl("https://www.facebook.com") }
                }

                // Row 2 (Posts, Groups, Series)
                Row(
                    modifier = Modifier.fillMaxWidth(),
                    horizontalArrangement = Arrangement.spacedBy(8.dp)
                ) {
                    AppCard("المنشورات (4)", Modifier.weight(1f), 80) { onOpenUrl("https://twitter.com") }
                    AppCard("المجموعات (5)", Modifier.weight(1f), 80) { onOpenUrl("https://t.me") }
                    AppCard("المسلسلات (6)", Modifier.weight(1f), 80) { onOpenUrl("https://www.youtube.com/results?search_query=series") }
                }

                // Row 3 (Games - Full Width)
                AppCard("الألعاب (7) - منصات ألعاب الويب الخفيفة", Modifier.fillMaxWidth(), 90) {
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
                    modifier = Modifier.padding(14.dp),
                    horizontalAlignment = Alignment.CenterHorizontally
                ) {
                    Text(
                        text = "تصميم وبرمجة الدكتور / مالك الرميمة",
                        color = Color.White,
                        fontSize = 15.sp,
                        fontWeight = FontWeight.Bold,
                        textAlign = TextAlign.Center
                    )
                    Spacer(modifier = Modifier.height(4.dp))
                    Text(
                        text = "رقم هاتف / واتساب: 771134103",
                        color = Color(0xFF4ADE80),
                        fontSize = 13.sp,
                        textAlign = TextAlign.Center
                    )
                }
            }
        }
    }
}

@Composable
fun AppCard(
    title: String,
    modifier: Modifier = Modifier,
    heightDp: Int = 80,
    onClick: () -> Unit
) {
    Card(
        modifier = modifier
            .height(heightDp.dp)
            .clickable { onClick() },
        shape = RoundedCornerShape(14.dp),
        colors = CardDefaults.cardColors(containerColor = Color(0xFF27272A))
    ) {
        Box(
            modifier = Modifier
                .fillMaxSize()
                .padding(8.dp),
            contentAlignment = Alignment.Center
        ) {
            Text(
                text = title,
                color = Color.White,
                fontSize = 13.sp,
                fontWeight = FontWeight.Medium,
                textAlign = TextAlign.Center
            )
        }
    }
}
