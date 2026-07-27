"""
Compute Hedges' g effect sizes for Migraine Frequency (headache days) using the
real data reported in the source PDF (Table 2), for consistency with the
existing Hedges' g tables (VAS, MIDAS, HIT-6, etc.) already provided by the author.

Method:
  - Within-group (paired, baseline -> follow-up): Cohen's d_z = mean_diff / SD_diff,
    where SD_diff = sqrt(SD1^2 + SD2^2 - 2*r*SD1*SD2). Since individual-level paired
    data / test-retest correlation (r) are not available, r = 0.5 is assumed
    (standard neutral default per Cohen 1988 / Morris & DeShon 2002).
  - Between-group (independent groups, on the paired change score): Cohen's d on the
    two groups' change scores using the SD_diff computed above as each group's SD,
    pooled via the standard pooled-SD formula.
  - Hedges' small-sample correction J = 1 - 3/(4*df - 1) applied to both.
  - Approximate variance / 95% CI via standard formulas (Cohen 1988; Borenstein et al. 2009).
"""
import math

R = 0.5  # assumed baseline-followup correlation

def sd_diff(sd1, sd2, r=R):
    return math.sqrt(sd1**2 + sd2**2 - 2*r*sd1*sd2)

def within_group_g(mean1, sd1, mean2, sd2, n):
    diff = mean1 - mean2
    sdd = sd_diff(sd1, sd2)
    dz = diff / sdd
    df = n - 1
    J = 1 - 3/(4*df - 1)
    g = dz * J
    se_dz = math.sqrt(1/n + dz**2/(2*n))
    lo = (dz - 1.96*se_dz) * J
    hi = (dz + 1.96*se_dz) * J
    return g, lo, hi, sdd

def between_group_g(mean_diff1, sdd1, n1, mean_diff2, sdd2, n2):
    md = mean_diff1 - mean_diff2
    df = n1 + n2 - 2
    pooled_sd = math.sqrt(((n1-1)*sdd1**2 + (n2-1)*sdd2**2) / df)
    d = md / pooled_sd
    J = 1 - 3/(4*df - 1)
    g = d * J
    se_d = math.sqrt((n1+n2)/(n1*n2) + d**2/(2*df))
    lo = (d - 1.96*se_d) * J
    hi = (d + 1.96*se_d) * J
    return g, lo, hi

# Real data from PDF Table 2 (Migraine frequency)
groups = {
    "G1_supra": dict(n=28, base=(14.18,3.95), t1=(7.68,2.84), t3=(6.59,2.7)),
    "G2_infra": dict(n=27, base=(15.13,4.51), t1=(9.19,4.03), t3=(6.16,2.48)),
    "G3_sham":  dict(n=28, base=(12.32,4.99), t1=(14.27,4.15), t3=(12.94,5.01)),
}

print("=== Within-group Hedges' g (Baseline -> 1 Month) ===")
sdd_t1 = {}
for k, v in groups.items():
    (m1,s1) = v["base"]; (m2,s2) = v["t1"]; n = v["n"]
    g, lo, hi, sdd = within_group_g(m1,s1,m2,s2,n)
    sdd_t1[k] = (m1-m2, sdd, n)
    print(f"{k}: g={g:.2f} [{lo:.2f}, {hi:.2f}]  (SD_diff={sdd:.3f})")

print("\n=== Within-group Hedges' g (Baseline -> 3 Months) ===")
sdd_t3 = {}
for k, v in groups.items():
    (m1,s1) = v["base"]; (m2,s2) = v["t3"]; n = v["n"]
    g, lo, hi, sdd = within_group_g(m1,s1,m2,s2,n)
    sdd_t3[k] = (m1-m2, sdd, n)
    print(f"{k}: g={g:.2f} [{lo:.2f}, {hi:.2f}]  (SD_diff={sdd:.3f})")

def pooled_re(estimates):
    # estimates: list of (g, se_g)
    # Fixed-effect
    ws = [1/se**2 for g, se in estimates]
    sum_w = sum(ws)
    fixed_mean = sum(w*g for w,(g,se) in zip(ws, estimates)) / sum_w
    Q = sum(w*(g-fixed_mean)**2 for w,(g,se) in zip(ws, estimates))
    dfQ = len(estimates) - 1
    sum_w2 = sum(w**2 for w in ws)
    C = sum_w - sum_w2/sum_w
    tau2 = max(0, (Q - dfQ)/C)
    ws_re = [1/(se**2 + tau2) for g,se in estimates]
    sum_w_re = sum(ws_re)
    re_mean = sum(w*g for w,(g,se) in zip(ws_re, estimates)) / sum_w_re
    se_re = math.sqrt(1/sum_w_re)
    return re_mean, re_mean-1.96*se_re, re_mean+1.96*se_re, tau2

print("\n=== Pooled Random-Effects (within-group, Baseline->1mo) ===")
ests = []
for k, v in groups.items():
    (m1,s1) = v["base"]; (m2,s2) = v["t1"]; n = v["n"]
    g, lo, hi, sdd = within_group_g(m1,s1,m2,s2,n)
    se_g = (hi-lo)/(2*1.96)
    ests.append((g, se_g))
re_mean, lo, hi, tau2 = pooled_re(ests)
print(f"Pooled RE: g={re_mean:.2f} [{lo:.2f}, {hi:.2f}]  (tau2={tau2:.3f})")

print("\n=== Between-group Hedges' g (Delta Baseline - 1 Month) ===")
pairs = [("G1_supra","G3_sham"), ("G2_infra","G3_sham"), ("G1_supra","G2_infra")]
for a,b in pairs:
    md1, sdd1, n1 = sdd_t1[a]
    md2, sdd2, n2 = sdd_t1[b]
    g, lo, hi = between_group_g(md1, sdd1, n1, md2, sdd2, n2)
    print(f"{a} vs {b}: g={g:.2f} [{lo:.2f}, {hi:.2f}]")

print("\n=== Between-group Hedges' g (Delta Baseline - 3 Months) ===")
for a,b in pairs:
    md1, sdd1, n1 = sdd_t3[a]
    md2, sdd2, n2 = sdd_t3[b]
    g, lo, hi = between_group_g(md1, sdd1, n1, md2, sdd2, n2)
    print(f"{a} vs {b}: g={g:.2f} [{lo:.2f}, {hi:.2f}]")
