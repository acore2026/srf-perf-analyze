# SRF Resource Reuse Performance Gain Analysis

## Executive Summary

Yes. If the SRF solution removes a large part of the AMF-side PBU_C-A1 footprint, and the released VM resources are reused by traffic-sensitive AMF components, the AMF pool capacity should increase.

The simple whole-pool VM view is:

$$
\frac{47}{318} = 14.8\%
$$

This is correct, but it understates the performance value because not every AMF VM type scales with service volume. After excluding fixed-overhead VM types, the capacity-relevant gain becomes:

- **18.2%** by VM count.
- **22.4%** CPU headroom for traffic-sensitive functions.
- **17.7%** memory headroom, which is the conservative resource-bound capacity gain.
- **19.9%** storage headroom.

For reporting, the defensible headline is: **SRF releases enough PBU_C-A1 resources to provide about 18% additional capacity headroom for the AMF components that actually need to scale with traffic, with CPU headroom above 22%.**

## Why SRF Releases PBU_C-A1 Resources

The proposal in `S2-2600434-markdown/S2-2600434.md` introduces SRF as a light-weight signalling routing function. SRF distributes NAS/N2 signalling between UE/RAN and control plane functions, forwards NAS messages to multiple NAS termination points, and establishes point-to-point signalling connections with RAN.

This changes the 5G AMF model where RAN nodes are fully meshed with every AMF in the pool. In the local analysis, this AMF-side link/routing function is mapped to `LINK + NGECM`, carried by `PBU_C-A1`. Therefore, if SRF moves the fan-out signalling function outside AMF, part of the PBU_C-A1 footprint can be removed or repurposed.

## Baseline Assumptions

| Item | Value |
| --- | ---: |
| RAN nodes, `M` | 150,000 |
| AMF instances, `N` | 6 |
| SRF instances, `K` | 2 |
| PBU_C-A1 VMs per AMF | 12 |
| Pool PBU_C-A1 VMs, `V_5G` | 72 |
| PBU_C-A1 VM resource | 12 core / 32 GB RAM / 38 GB storage |
| PBU_C2-A VM resource | 12 core / 44 GB RAM / 38 GB storage |
| PBU_C2-A dynamic spec per VM | 447 |

The full AMF pool contains:

$$
\text{Total AMF VMs} = 6 \times 53 = 318
$$

## PBU_C-A1 VM Savings

5G AMF pool link count:

$$
L_{5G} = M \times N = 150{,}000 \times 6 = 900{,}000
$$

SRF link count:

$$
L_{SRF} = M \times K + K \times N = 150{,}000 \times 2 + 2 \times 6 = 300{,}012
$$

Reduction ratio:

$$
\rho = \frac{L_{5G} - L_{SRF}}{L_{5G}}
     = \frac{900{,}000 - 300{,}012}{900{,}000}
     = 66.665\%
$$

Conservative PBU_C-A1 VM savings:

$$
\text{Saved PBU\_C-A1 VMs} = \left\lfloor 72 \times 66.665\% \right\rfloor = 47
$$

Released resources:

| Resource | Calculation | Released |
| --- | ---: | ---: |
| CPU | $47 \times 12$ core | 564 core |
| RAM | $47 \times 32$ GB | 1,504 GB |
| Storage | $47 \times 38$ GB | 1,786 GB |

## Why 14.8% Understates the Performance Gain

The direct VM-count gain over the whole AMF pool is:

$$
\text{Whole-pool VM gain} = \frac{47}{318} = 14.8\%
$$

This denominator includes VM types that are mostly fixed overhead and do not need to scale linearly when service volume increases:

| Fixed-overhead VM type | Pool VMs | Pool CPU | Pool RAM | Pool Storage |
| --- | ---: | ---: | ---: | ---: |
| `OMU_ARM` | 12 | 144 core | 816 GB | 4,200 GB |
| `PBU_C-A3_ARM` | 12 | 96 core | 216 GB | 336 GB |
| `OMU_L1_ARM` | 12 | 48 core | 312 GB | 480 GB |
| `PBU_L_ARM` | 12 | 48 core | 288 GB | 384 GB |
| `PBU_L-M_ARM` | 12 | 48 core | 264 GB | 312 GB |
| **Fixed-overhead total** | **60** | **384 core** | **1,896 GB** | **5,712 GB** |

So the service-volume-sensitive baseline should exclude those fixed VM types:

$$
\text{Capacity-relevant VMs} = 318 - 60 = 258
$$

The VM-count gain for the part of AMF that actually scales with service volume is:

$$
\text{Capacity-relevant VM gain} = \frac{47}{258} = 18.2\%
$$

This is a stronger and more accurate denominator than the whole-pool `47 / 318` view.

## Resource-Weighted Capacity Gain

The AMF baseline per instance is 53 VMs, 484 cores, 1,736 GB RAM, and 2,448 GB storage. Across 6 AMFs:

$$
\text{Pool CPU} = 6 \times 484 = 2{,}904\ \text{core}
$$

$$
\text{Pool RAM} = 6 \times 1{,}736 = 10{,}416\ \text{GB}
$$

$$
\text{Pool storage} = 6 \times 2{,}448 = 14{,}688\ \text{GB}
$$

After excluding fixed-overhead VM types:

$$
\text{Capacity-relevant CPU} = 2{,}904 - 384 = 2{,}520\ \text{core}
$$

$$
\text{Capacity-relevant RAM} = 10{,}416 - 1{,}896 = 8{,}520\ \text{GB}
$$

$$
\text{Capacity-relevant storage} = 14{,}688 - 5{,}712 = 8{,}976\ \text{GB}
$$

The 47 saved PBU_C-A1 VMs release 564 cores, 1,504 GB RAM, and 1,786 GB storage. Therefore the resource-weighted gains are:

$$
\text{CPU gain} = \frac{564}{2{,}520} = 22.4\%
$$

$$
\text{RAM gain} = \frac{1{,}504}{8{,}520} = 17.7\%
$$

$$
\text{Storage gain} = \frac{1{,}786}{8{,}976} = 19.9\%
$$

If the AMF traffic-sensitive functions need CPU, memory, and storage to scale together, the conservative capacity gain is bounded by memory:

$$
\text{Conservative capacity gain} = \min(22.4\%, 17.7\%, 19.9\%) = 17.7\%
$$

If the reported KPI is CPU-bound signalling processing headroom, the gain can be reported as **22.4% CPU headroom** for the capacity-relevant AMF components.

## Optional: Reuse Resources to Scale PBU_C-A

If the released resources are specifically reused to add `PBU_C2-A_ARM` VMs, each additional VM needs:

$$
\text{PBU\_C2-A resource per VM} = 12\ \text{core} + 44\ \text{GB RAM} + 38\ \text{GB storage}
$$

Maximum additional VMs by each resource:

| Constraint | Calculation | Max new PBU_C-A VMs |
| --- | ---: | ---: |
| CPU | $\left\lfloor 564 / 12 \right\rfloor$ | 47 |
| RAM | $\left\lfloor 1{,}504 / 44 \right\rfloor$ | 34 |
| Storage | $\left\lfloor 1{,}786 / 38 \right\rfloor$ | 47 |

RAM is the binding constraint, so the released PBU_C-A1 resources can support **34 additional PBU_C-A VMs** without adding extra memory.

## PBU_C-A Scale-Out Capacity Gain

Current PBU_C-A pool:

$$
\text{Current PBU\_C-A VMs} = 6 \times 12 = 72
$$

$$
\text{Current capacity} = 72 \times 447 = 32{,}184\ \text{dynamic-spec units}
$$

Resource-bound maximum:

$$
\text{New VMs} = 72 + 34 = 106
$$

$$
\text{New capacity} = 106 \times 447 = 47{,}382
$$

$$
\text{Capacity gain} = \frac{47{,}382}{32{,}184} - 1 = 47.2\%
$$

Balanced deployment across 6 AMFs:

$$
\text{Balanced added VMs} = \left\lfloor \frac{34}{6} \right\rfloor \times 6 = 30
$$

$$
\text{New VMs} = 72 + 30 = 102
$$

$$
\text{New capacity} = 102 \times 447 = 45{,}594
$$

$$
\text{Capacity gain} = \frac{45{,}594}{32{,}184} - 1 = 41.7\%
$$

## Sensitivity

If the deployment can add extra memory or use a PBU_C-A flavor closer to the PBU_C-A1 memory profile, CPU and storage would allow up to **47 additional PBU_C-A VMs**:

$$
\text{Capacity gain} = \frac{47}{72} = 65.3\%
$$

This is an upper bound because the released memory is insufficient for 47 standard `PBU_C2-A_ARM` VMs.

## Conclusion

The SRF solution can increase system capacity if released PBU_C-A1 resources are reused for traffic-sensitive AMF functions. The whole-pool VM gain is **14.8%**, but this includes fixed-overhead VMs that do not need to scale with service volume.

After excluding fixed-overhead VM types, the better performance view is:

- **18.2% capacity-relevant VM gain**.
- **22.4% CPU headroom gain**.
- **17.7% conservative resource-bound capacity gain**.
- **19.9% storage headroom gain**.

This gives a stronger message for management: **SRF is not only reducing VM count; it releases a meaningful amount of reusable compute resource from the signalling fan-out layer and converts it into about 18% extra capacity headroom for the AMF components that actually scale with traffic.**

This proof assumes the excluded VM types remain fixed as service volume increases. If another non-excluded AMF component becomes the next bottleneck, the end-to-end system gain will be capped by that component.
