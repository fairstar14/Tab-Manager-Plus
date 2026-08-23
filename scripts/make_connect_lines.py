"""生成 connect-lines.png 图标：两个圆点 + 一条虚线，64x64 透明背景。
风格参考 duplicates.png：深灰主色 (76,76,76)，透明背景。
"""
from PIL import Image, ImageDraw

SIZE = 64
COLOR = (76, 76, 76, 255)

img = Image.new("RGBA", (SIZE, SIZE), (255, 255, 255, 0))
draw = ImageDraw.Draw(img)

# 两个圆点（与 SVG 一致：viewBox 0 0 24 24，cx/cy=6 和 18，r=3）
# 缩放到 64px：6/24*64=16，18/24*64=48，r=3/24*64=8
r = 8
draw.ellipse((16 - r, 16 - r, 16 + r, 16 + r), fill=COLOR)
draw.ellipse((48 - r, 48 - r, 48 + r, 48 + r), fill=COLOR)

# 虚线连接（从 16,16 到 48,48）
# stroke-dasharray="3 2" -> 实线3虚2，在24坐标系下。换算到64px：dash=8 gap~5.3
import math
x1, y1 = 16, 16
x2, y2 = 48, 48
dx, dy = x2 - x1, y2 - y1
length = math.hypot(dx, dy)
ux, uy = dx / length, dy / length
dash = 8.0
gap = 5.3
line_w = 5

pos = 0.0
on = True
while pos < length:
    seg = dash if on else gap
    end = min(pos + seg, length)
    if on:
        sx, sy = x1 + ux * pos, y1 + uy * pos
        ex, ey = x1 + ux * end, y1 + uy * end
        draw.line((sx, sy, ex, ey), fill=COLOR, width=line_w)
    pos = end
    on = not on

img.save("images/connect-lines.png")
print("saved images/connect-lines.png", img.size)
