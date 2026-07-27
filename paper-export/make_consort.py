import matplotlib.pyplot as plt
from matplotlib.patches import FancyBboxPatch
from matplotlib.lines import Line2D

fig, ax = plt.subplots(figsize=(11, 13))
ax.set_xlim(0, 11)
ax.set_ylim(1.8, 13)
ax.axis('off')

def box(x, y, w, h, text, facecolor, fontsize=9.5, edgecolor="#444444"):
    b = FancyBboxPatch((x, y), w, h, boxstyle="round,pad=0.02,rounding_size=0.08",
                        linewidth=1.3, edgecolor=edgecolor, facecolor=facecolor, zorder=2)
    ax.add_patch(b)
    ax.text(x + w/2, y + h/2, text, ha='center', va='center', fontsize=fontsize,
             zorder=3, wrap=True, linespacing=1.4)
    return (x + w/2, y, y + h)

def arrow(x, y1, y2):
    ax.annotate('', xy=(x, y2), xytext=(x, y1),
                 arrowprops=dict(arrowstyle='-|>', color='#333333', lw=1.4), zorder=1)

green = "#d9f0d3"
red = "#f9d5d3"
blue = "#d3e5f9"
yellow = "#fbf0c9"
purple = "#e6d9f2"

ax.text(5.5, 12.6, "CONSORT Flow Diagram", ha='center', va='center',
        fontsize=15, fontweight='bold')

# Assessed for eligibility
cx, y1, y2 = box(3.25, 11.5, 5.0, 0.7, "Assessed for eligibility (n = 105)", green)

# Excluded
cx, y1, y2 = box(3.25, 10.15, 5.0, 0.95,
                  "Excluded (n = 17)\n• Not meeting inclusion criteria / declined\nor other reasons (n = 17)", red, fontsize=8.7)

# Randomized
cx, y1, y2 = box(3.25, 9.05, 5.0, 0.7, "Randomized (n = 88)", blue)

# arrows: eligibility(bottom=11.5) -> excluded(top=11.1); excluded(bottom=10.15)->randomized(top=9.75)
arrow(5.75, 11.5, 11.1)
arrow(5.75, 10.15, 9.75)

col_x = [0.6, 4.0, 7.4]
col_w = 3.0
labels = ["Supraorbital TENS", "Infraorbital TENS", "Sham TENS"]
alloc_n = ["30", "29", "29"]
recv_n = ["29", "28", "29"]
notrecv = ["1", "1", "1"]
lost_n = ["2", "2", "1"]
lost_detail = ["Discontinued (1)\nLost to follow-up (1)",
               "Discontinued (2)",
               "Lost to follow-up (1)"]
analyzed_n = ["28", "27", "28"]

# Allocated row
alloc_tops = []
for i in range(3):
    _, y1a, y2a = box(col_x[i], 7.75, col_w, 0.85,
                       f"Allocated to\n{labels[i]} (n = {alloc_n[i]})", yellow, fontsize=9)
    alloc_tops.append((col_x[i]+col_w/2, y1a, y2a))

# arrows from Randomized (y1=9.05) down to each allocated box (y2a=8.60)
for cx_i, y1a, y2a in alloc_tops:
    arrow(cx_i, 9.05, y2a)
# horizontal connecting line from center to branches
ax.plot([5.75, 5.75], [9.05, 8.9], color='#333333', lw=1.4, zorder=1)
ax.plot([2.1, 8.9], [8.9, 8.9], color='#333333', lw=1.4, zorder=1)
for cx_i, y1a, y2a in alloc_tops:
    ax.plot([cx_i, cx_i], [8.9, y2a], color='#333333', lw=1.4, zorder=1)

# Received intervention row
recv_tops = []
for i in range(3):
    _, y1r, y2r = box(col_x[i], 6.55, col_w, 0.85,
                       f"Received intervention\n(n = {recv_n[i]})\nDid not receive (n = {notrecv[i]})",
                       purple, fontsize=8.7)
    recv_tops.append((col_x[i]+col_w/2, y1r, y2r))
    arrow(col_x[i]+col_w/2, alloc_tops[i][1], y2r)

# Lost to follow-up row
lost_tops = []
for i in range(3):
    _, y1l, y2l = box(col_x[i], 5.05, col_w, 1.15,
                       f"Lost to follow-up /\nMissing month-3 data\n(n = {lost_n[i]})\n{lost_detail[i]}",
                       red, fontsize=8.2)
    lost_tops.append((col_x[i]+col_w/2, y1l, y2l))
    arrow(col_x[i]+col_w/2, recv_tops[i][1], y2l)

# Analyzed row
analyzed_tops = []
for i in range(3):
    _, y1z, y2z = box(col_x[i], 3.85, col_w, 0.85,
                       f"Analyzed (n = {analyzed_n[i]})\nComplete-case\nprimary analysis",
                       green, fontsize=8.7)
    analyzed_tops.append((col_x[i]+col_w/2, y1z, y2z))
    arrow(col_x[i]+col_w/2, lost_tops[i][1], y2z)

ax.text(5.75, 3.15,
        "Primary complete-case analysis: n = 83 (Supraorbital 28 / Infraorbital 27 / Sham 28)\n"
        "All 83 participants provided baseline, 1-month, and 3-month outcome data for secondary measures.",
        ha='center', va='center', fontsize=8.8)

ax.text(5.75, 2.35,
        "Note: Numbers of participants who did not receive intervention are approximate based on available\n"
        "disposition data; exact session attendance is reported in supplementary materials.",
        ha='center', va='center', fontsize=7.6, style='italic', color='#555555')

plt.tight_layout()
plt.savefig('/workspace/paper-export/consort_flow_diagram.png', dpi=200, bbox_inches='tight', facecolor='white')
print("saved")
