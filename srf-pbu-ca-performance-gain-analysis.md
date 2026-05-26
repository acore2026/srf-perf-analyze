# SRF Resource Reuse Performance Gain Analysis

## Executive Summary

Yes. If the SRF solution removes a large part of the AMF-side PBU_C-A1 footprint, and the released VM resources are reused to scale out PBU_C-A processing VMs, the AMF pool capacity should increase.

Using the assumptions from `part-of-my-analysis.md`, the SRF topology can conservatively release **47 PBU_C-A1 VMs**. Reusing those resources to add `PBU_C2-A_ARM` VMs gives:

- **Resource-bound maximum:** add **34 PBU_C-A VMs**, increasing PBU_C-A capacity by **47.2%**.
- **Balanced 6-AMF deployment:** add **30 PBU_C-A VMs** (5 per AMF), increasing PBU_C-A capacity by **41.7%**.

The result is positive as long as PBU_C-A is on the capacity-critical path and other system components are not the next bottleneck.

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

## PBU_C-A1 VM Savings

5G AMF pool link count:

```text
L_5G = M * N = 150,000 * 6 = 900,000
```

SRF link count:

```text
L_SRF = M * K + K * N = 150,000 * 2 + 2 * 6 = 300,012
```

Reduction ratio:

```text
rho = (L_5G - L_SRF) / L_5G
    = (900,000 - 300,012) / 900,000
    = 66.665%
```

Conservative PBU_C-A1 VM savings:

```text
Saved PBU_C-A1 VMs = floor(72 * 66.665%) = 47
```

Released resources:

| Resource | Calculation | Released |
| --- | ---: | ---: |
| CPU | 47 * 12 core | 564 core |
| RAM | 47 * 32 GB | 1,504 GB |
| Storage | 47 * 38 GB | 1,786 GB |

## Reuse Resources to Scale PBU_C-A

The target scale-out VM is `PBU_C2-A_ARM`, treated here as the PBU_C-A processing VM. Each additional VM needs:

```text
12 core / 44 GB RAM / 38 GB storage
```

Maximum additional VMs by each resource:

| Constraint | Calculation | Max new PBU_C-A VMs |
| --- | ---: | ---: |
| CPU | floor(564 / 12) | 47 |
| RAM | floor(1,504 / 44) | 34 |
| Storage | floor(1,786 / 38) | 47 |

RAM is the binding constraint, so the released PBU_C-A1 resources can support **34 additional PBU_C-A VMs** without adding extra memory.

## Capacity Gain

Current PBU_C-A pool:

```text
Current PBU_C-A VMs = 6 AMFs * 12 VMs per AMF = 72
Current capacity = 72 * 447 = 32,184 dynamic-spec units
```

Resource-bound maximum:

```text
New VMs = 72 + 34 = 106
New capacity = 106 * 447 = 47,382
Capacity gain = 47,382 / 32,184 - 1 = 47.2%
```

Balanced deployment across 6 AMFs:

```text
Balanced added VMs = floor(34 / 6) * 6 = 30
New VMs = 72 + 30 = 102
New capacity = 102 * 447 = 45,594
Capacity gain = 45,594 / 32,184 - 1 = 41.7%
```

## Sensitivity

If the deployment can add extra memory or use a PBU_C-A flavor closer to the PBU_C-A1 memory profile, CPU and storage would allow up to **47 additional PBU_C-A VMs**:

```text
Capacity gain = 47 / 72 = 65.3%
```

This is an upper bound because the released memory is insufficient for 47 standard `PBU_C2-A_ARM` VMs.

## Conclusion

The SRF solution can increase system capacity if released PBU_C-A1 resources are reused for PBU_C-A scale-out. Under the current VM profiles, the defensible planning number is:

- **41.7% capacity gain** for an evenly balanced 6-AMF deployment.
- **47.2% capacity gain** if the 34 added PBU_C-A VMs can be placed flexibly across the pool.

This proof assumes PBU_C-A processing capacity is the limiting factor. If another AMF component becomes the bottleneck first, the end-to-end system gain will be capped by that component.
