# Keyframe keeper job IDs (full UUIDs)

The `generate_video` `start_image` (and `end_image`) need the **full** job UUID, not the 8-char
prefix in the filenames / credit-log. These were recovered once via `show_generations`; kept here so
that lookup never has to be repeated.

| Scene | Keeper file | Full job UUID |
|---|---|---|
| 1 | `s01-key-v2-darkfield-43fb641c.png` | `43fb641c-c428-4f36-a0a0-80f35d9d7978` |
| 2 | `s02-key-v8-horizdepth-c8ae7af5.png` | `c8ae7af5-ce0b-49b0-a1d1-3581708d8212` |
| 3 | `s03-key-v1-web-9d214ea7.png` | `9d214ea7-0590-4f9b-b1e5-92e323ad7a9a` |
| 4 | `s04-key-v6-midlabels-8941e136.png` | `8941e136-c440-4117-a580-50f2b2671cbf` |
| 5 | `s05-key-v7-notext-bal-221a70a7.png` | `221a70a7-15fc-4435-9b0e-c793f1481486` |
| 6 | `s06-key-v6-notext-doublespend-62e071ba.png` | `62e071ba-4e5d-456c-a4a0-cf83cfc95573` |
| 7 | `s07-key-v5-upright-1775419a.png` | `1775419a-59d6-4834-b672-649639a44c6e` |
| 8 | `s08-key-v6-zigzag-6dfce63b.png` | `6dfce63b-f8f8-43fa-bbd0-368563f0880e` |
| 9 | `s09-key-v4-leaderlines-ecfa8aac.png` | `ecfa8aac-cb08-4cde-b13c-6a509621e98b` |

Lesson: record the full UUID at generation time — the credit-log only kept 8 chars, which cannot be
passed to `start_image`.
