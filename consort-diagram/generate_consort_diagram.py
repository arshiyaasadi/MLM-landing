"""
Generates a CONSORT participant-flow diagram for the migraine
supraorbital / infraorbital / sham nerve-stimulation trial described
in the study text.

Note on the source numbers: as literally written, the sham arm's
"did not receive allocated intervention (n=1)" does not reconcile with
its stated "received treatment (n=29)" and "analyzed (n=28)" values
(29 allocated - 1 not receiving - 1 lost to follow-up = 27, not 28).
Every other arm (and the 105 / 17 / 88 / 83 headline totals) reconciles
exactly. This script therefore assumes the sham arm had 0 "did not
receive" dropouts (rather than 1), which is the only single-number
change that makes ALL stated figures -- including the twice-repeated
final analysis counts (28 / 27 / 28 = 83) -- internally consistent.
Re-run with different numbers below if your source data differs.
"""

import matplotlib.pyplot as plt
from matplotlib.patches import FancyBboxPatch
from matplotlib.lines import Line2D

# ---------------------------------------------------------------------------
# Trial numbers
# ---------------------------------------------------------------------------
ASSESSED = 105
EXCLUDED_PRE_RANDOMIZATION = 17
RANDOMIZED = 88

GROUPS = ["Supraorbital", "Infraorbital", "Sham"]
ALLOCATED = {"Supraorbital": 30, "Infraorbital": 29, "Sham": 29}
NOT_RECEIVED = {"Supraorbital": 1, "Infraorbital": 1, "Sham": 0}
RECEIVED = {g: ALLOCATED[g] - NOT_RECEIVED[g] for g in GROUPS}
LOST_LABEL = {
    "Supraorbital": "Discontinued intervention (n = 1)",
    "Infraorbital": "Lost to follow-up (n = 1)",
    "Sham": "Lost to follow-up (n = 1)",
}
LOST_N = {"Supraorbital": 1, "Infraorbital": 1, "Sham": 1}
ANALYZED = {g: RECEIVED[g] - LOST_N[g] for g in GROUPS}
TOTAL_ANALYZED = sum(ANALYZED.values())

assert RANDOMIZED == sum(ALLOCATED.values())
assert TOTAL_ANALYZED == 83, TOTAL_ANALYZED

# ---------------------------------------------------------------------------
# Drawing helpers
# ---------------------------------------------------------------------------
FIG_W, FIG_H = 15, 18
fig, ax = plt.subplots(figsize=(FIG_W, FIG_H))
ax.set_xlim(-6, 100)
ax.set_ylim(0, 122)
ax.axis("off")

BOX_FC = "#eef3fb"
BOX_EC = "#2c5282"
SIDE_FC = "#fdf3e7"
SIDE_EC = "#c05621"
HEAD_FC = "#2c5282"


def box(cx, cy, w, h, text, fc=BOX_FC, ec=BOX_EC, fontsize=10.3, fontweight="normal",
        text_color="black", boxstyle="round,pad=0.02,rounding_size=0.6"):
    patch = FancyBboxPatch(
        (cx - w / 2, cy - h / 2), w, h,
        boxstyle=boxstyle,
        linewidth=1.4,
        edgecolor=ec,
        facecolor=fc,
        zorder=3,
    )
    ax.add_patch(patch)
    ax.text(
        cx, cy, text,
        ha="center", va="center",
        fontsize=fontsize, fontweight=fontweight, color=text_color,
        zorder=4, linespacing=1.35,
        wrap=True,
    )
    return patch


def v_arrow(x, y_top, y_bottom, lw=1.5, color="black"):
    ax.annotate(
        "", xy=(x, y_bottom), xytext=(x, y_top),
        arrowprops=dict(arrowstyle="-|>", lw=lw, color=color, shrinkA=0, shrinkB=0),
        zorder=2,
    )


def h_arrow(x_left, x_right, y, lw=1.4, color="black"):
    ax.annotate(
        "", xy=(x_right, y), xytext=(x_left, y),
        arrowprops=dict(arrowstyle="-|>", lw=lw, color=color, shrinkA=0, shrinkB=0),
        zorder=2,
    )


def stage_label(y, text):
    ax.text(-2, y, text, ha="center", va="center", fontsize=12, fontweight="bold",
            color="#1a202c", rotation=90, style="italic", zorder=5)


# ---------------------------------------------------------------------------
# Title
# ---------------------------------------------------------------------------
ax.text(50, 120, "CONSORT 2010 Flow Diagram", ha="center", va="center",
        fontsize=17, fontweight="bold")
ax.text(50, 117, "Supraorbital vs. Infraorbital Nerve Stimulation vs. Sham for Migraine",
        ha="center", va="center", fontsize=11.5, style="italic", color="#333333")

# ---------------------------------------------------------------------------
# Enrollment
# ---------------------------------------------------------------------------
y_assessed = 110
box(50, y_assessed, 46, 6.4, f"Assessed for eligibility\n(n = {ASSESSED})", fontsize=11)

y_excluded = 102
box(80, y_excluded, 36, 9.5,
    f"Excluded (n = {EXCLUDED_PRE_RANDOMIZATION})\n"
    "\u2022 Did not meet inclusion criteria\n"
    "\u2022 Declined to participate\n"
    "\u2022 Other logistical reasons",
    fc=SIDE_FC, ec=SIDE_EC, fontsize=9.7)

y_randomized = 92.5
v_arrow(50, y_assessed - 3.2, y_randomized + 3.2)
h_arrow(50, 62, y_excluded)

box(50, y_randomized, 46, 6.4, f"Randomized 1:1:1\n(n = {RANDOMIZED})", fontsize=11, fontweight="bold")

# ---------------------------------------------------------------------------
# Column layout for the three arms
# ---------------------------------------------------------------------------
COL_X = {"Supraorbital": 16, "Infraorbital": 50, "Sham": 84}
COL_W = 28

# Split arrow: vertical stem then horizontal bar then three verticals down to allocation
y_split_top = y_randomized - 3.2
y_split_bar = 87.5
ax.plot([50, 50], [y_split_top, y_split_bar], color="black", lw=1.5, zorder=2)
ax.plot([COL_X["Supraorbital"], COL_X["Sham"]], [y_split_bar, y_split_bar], color="black", lw=1.5, zorder=2)
for g in GROUPS:
    v_arrow(COL_X[g], y_split_bar, 84.7)

# ---------------------------------------------------------------------------
# Allocation
# ---------------------------------------------------------------------------
stage_label(78.5, "Allocation")
y_alloc = 81.5
for g in GROUPS:
    box(COL_X[g], y_alloc, COL_W, 7.2,
        f"Allocated to {g}\n(n = {ALLOCATED[g]})", fontsize=9.8, fontweight="bold")

y_not_received = 71.5
for g in GROUPS:
    v_arrow(COL_X[g], y_alloc - 3.6, y_not_received + 4.7)
    box(COL_X[g], y_not_received, COL_W - 2, 6.5,
        f"Did not receive allocated\nintervention (n = {NOT_RECEIVED[g]})",
        fc=SIDE_FC, ec=SIDE_EC, fontsize=9.0)

y_received = 62.5
for g in GROUPS:
    v_arrow(COL_X[g], y_not_received - 3.25, y_received + 3.6)
    box(COL_X[g], y_received, COL_W, 7.0,
        f"Received allocated\nintervention (n = {RECEIVED[g]})", fontsize=9.6)

# ---------------------------------------------------------------------------
# Follow-up
# ---------------------------------------------------------------------------
stage_label(53.5, "Follow-Up")
y_lost = 53.5
for g in GROUPS:
    v_arrow(COL_X[g], y_received - 3.5, y_lost + 3.25)
    box(COL_X[g], y_lost, COL_W - 2, 6.5, LOST_LABEL[g], fc=SIDE_FC, ec=SIDE_EC, fontsize=9.0)

# ---------------------------------------------------------------------------
# Analysis
# ---------------------------------------------------------------------------
stage_label(37.5, "Analysis")
y_analyzed = 41
for g in GROUPS:
    v_arrow(COL_X[g], y_lost - 3.25, y_analyzed + 5.2)
    box(COL_X[g], y_analyzed, COL_W, 10.3,
        f"Analyzed \u2013 complete case\n(n = {ANALYZED[g]})\n"
        "Baseline, 1-month, and\n3-month outcome data",
        fontsize=9.3, fc="#e6f4ea", ec="#276749")

# Convergence to total analyzed box
y_bar2 = 30.5
for g in GROUPS:
    v_arrow(COL_X[g], y_analyzed - 5.15, y_bar2)
ax.plot([COL_X["Supraorbital"], COL_X["Sham"]], [y_bar2, y_bar2], color="black", lw=1.5, zorder=2)
v_arrow(50, y_bar2, 26.2)

box(50, 22.5, 50, 7.4,
    f"Primary complete-case analysis\n(n = {TOTAL_ANALYZED}: "
    f"supraorbital {ANALYZED['Supraorbital']}, infraorbital {ANALYZED['Infraorbital']}, "
    f"sham {ANALYZED['Sham']})",
    fontsize=9.8, fontweight="bold", fc="#e6f4ea", ec="#276749")

# ---------------------------------------------------------------------------
# Footnote
# ---------------------------------------------------------------------------
ax.text(
    50, 5.5,
    "Note: Numbers reconciled for internal consistency \u2014 the sham arm is shown with 0 (not 1)\n"
    "\u201cdid not receive allocated intervention\u201d cases, as this is the only adjustment that makes every\n"
    "reported figure (105 \u2192 17 excluded \u2192 88 randomized \u2192 83 analyzed) arithmetically consistent.",
    ha="center", va="center", fontsize=8.3, style="italic", color="#666666",
)

plt.tight_layout()
fig.savefig("/workspace/consort-diagram/consort_flow_diagram.png", dpi=220, bbox_inches="tight")
fig.savefig("/workspace/consort-diagram/consort_flow_diagram.svg", bbox_inches="tight")
fig.savefig("/workspace/consort-diagram/consort_flow_diagram.pdf", bbox_inches="tight")
print("Saved diagram.")
print("ALLOCATED", ALLOCATED)
print("NOT_RECEIVED", NOT_RECEIVED)
print("RECEIVED", RECEIVED)
print("LOST_N", LOST_N)
print("ANALYZED", ANALYZED, "TOTAL", TOTAL_ANALYZED)
