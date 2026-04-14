import re

with open('index.html', 'r', encoding='utf-8') as f:
    content = f.read()

# Define patterns to extract the blocks (using regex carefully)
# News ends before <!-- First Cruise -->
# Video Section starts at <!-- Video Section -->

news_end = content.find('<!-- First Cruise -->')
video_start = content.find('<!-- Video Section -->')

if news_end == -1 or video_start == -1:
    print("Could not find delimiters")
    exit(1)

pre_content = content[:news_end]
post_content = content[video_start:]

middle_content = content[news_end:video_start]

# Extract First Cruise block
m_first = re.search(r'<!-- First Cruise -->[\s\S]*?(?=<!-- Recommended Cruise -->)', middle_content)
# Extract Recommended Cruise block
m_rec_cruise = re.search(r'<!-- Recommended Cruise -->[\s\S]*?(?=<!-- Recommended Course -->)', middle_content)
# Extract Ship & Purpose block
m_ship = re.search(r'<!-- Ship & Purpose -->[\s\S]*?(?=$)', middle_content)

if not (m_first and m_rec_cruise and m_ship):
    print("Could not extract blocks")
    exit(1)

first_cruise_html = m_first.group(0)
rec_cruise_html = m_rec_cruise.group(0)
ship_purpose_html = m_ship.group(0)

# Modify Recommended Cruise -> Recommended Features
# Change heading
rec_features_html = rec_cruise_html.replace('<!-- Recommended Cruise -->', '<!-- Recommended Features -->')
rec_features_html = rec_features_html.replace('<span class="subtitle">Recommended Cruise</span>おすすめクルーズから探す', '<span class="subtitle">Recommended Features</span>おすすめ特集')
rec_features_html = rec_features_html.replace('おすすめクルーズをもっと見る', 'おすすめ特集をもっと見る')
# Ensure background is u-bg-alt
rec_features_html = re.sub(r'class="u-section\s+[^"]*"', 'class="u-section u-bg-alt"', rec_features_html)

# Modify Ship & Purpose -> 目的・特徴で探す
ship_modified_html = ship_purpose_html.replace('<span class="subtitle">Ship & Purpose</span>客船・目的から探す', '<span class="subtitle">Purpose & Features</span>目的・特徴で探す')
ship_modified_html = ship_modified_html.replace('客船・目的をもっと見る', '目的・特徴をもっと見る')
# Ensure background is u-bg-white
ship_modified_html = re.sub(r'class="u-section\s+[^"]*"', 'class="u-section u-bg-white"', ship_modified_html)

# Modify First Cruise -> ensure background u-bg-alt
first_modified_html = re.sub(r'class="u-section\s+[^"]*"', 'class="u-section beginner u-bg-alt"', first_cruise_html)

# Combine blocks
new_middle = rec_features_html + ship_modified_html + first_modified_html

with open('index.html', 'w', encoding='utf-8') as f:
    f.write(pre_content + new_middle + post_content)

print("Updates applied successfully.")
