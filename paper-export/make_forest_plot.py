"""
Generate Figure 2: forest plot of between-group Hedges' g at final follow-up (T3),
Group1 (Supraorbital) vs Group3 (Sham) and Group2 (Infraorbital) vs Group3 (Sham),
based on Delta = Baseline - 3 Months (Table 10 data).
"""
import matplotlib.pyplot as plt
import numpy as np

outcomes = [
    "Migraine frequency",
    "Pain intensity (VAS)",
    "Disability (MIDAS)",
    "Headache impact (HIT-6)",
    "Analgesic-use frequency",
    "MPQ-5 (need preventive)",
]

# (g, lo, hi) for Group1 vs Group3 and Group2 vs Group3, from Table 10
g1_vs_g3 = {
    "Migraine frequency": (1.88, 1.25, 2.50),
    "Pain intensity (VAS)": (1.84, 1.22, 2.46),
    "Disability (MIDAS)": (1.11, 0.55, 1.66),
    "Headache impact (HIT-6)": (2.14, 1.49, 2.79),
    "Analgesic-use frequency": (1.48, 0.90, 2.07),
    "MPQ-5 (need preventive)": (1.17, 0.60, 1.72),
}
g2_vs_g3 = {
    "Migraine frequency": (2.10, 1.44, 2.76),
    "Pain intensity (VAS)": (1.35, 0.77, 1.93),
    "Disability (MIDAS)": (0.66, 0.12, 1.19),
    "Headache impact (HIT-6)": (2.44, 1.75, 3.14),
    "Analgesic-use frequency": (1.35, 0.77, 1.93),
    "MPQ-5 (need preventive)": (1.20, 0.64, 1.77),
}

n = len(outcomes)
y = np.arange(n)
offset = 0.17

fig, ax = plt.subplots(figsize=(8.5, 5.5))

for i, outc in enumerate(outcomes):
    g, lo, hi = g1_vs_g3[outc]
    ax.errorbar(g, y[i] + offset, xerr=[[g - lo], [hi - g]], fmt='s', color='#1f77b4',
                capsize=4, markersize=7, elinewidth=1.6, label='Supraorbital vs Sham' if i == 0 else None)
    g, lo, hi = g2_vs_g3[outc]
    ax.errorbar(g, y[i] - offset, xerr=[[g - lo], [hi - g]], fmt='o', color='#d62728',
                capsize=4, markersize=7, elinewidth=1.6, label='Infraorbital vs Sham' if i == 0 else None)

ax.axvline(0, color='#888888', lw=1, linestyle='-')
for thresh, lbl in [(0.2, 'small'), (0.5, 'medium'), (0.8, 'large')]:
    ax.axvline(thresh, color='#cccccc', lw=0.8, linestyle='--', zorder=0)

ax.set_yticks(y)
ax.set_yticklabels(outcomes, fontsize=10)
ax.invert_yaxis()
ax.set_xlabel("Hedges' g (Δ Baseline \u2212 3 Months) [95% CI]", fontsize=10.5)
ax.set_title("Between-Group Hedges' g at Final Follow-up (T3)\nSupraorbital / Infraorbital vs Sham", fontsize=12, fontweight='bold')
ax.set_xlim(-0.5, 3.4)
ax.legend(loc='lower right', frameon=True, fontsize=9.5)
ax.grid(axis='x', color='#eeeeee', lw=0.8, zorder=0)
ax.spines['top'].set_visible(False)
ax.spines['right'].set_visible(False)

plt.tight_layout()
plt.savefig('/workspace/paper-export/forest_plot_t3.png', dpi=200, bbox_inches='tight', facecolor='white')
print("saved")
