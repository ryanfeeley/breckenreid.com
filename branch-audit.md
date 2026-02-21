# Branch audit (work vs inferred main)

Date: 2026-02-21

## Repository state
- Current branch: `work`
- Local branches present: only `work`
- No `origin` (or any) git remotes configured

Because there is no local `main` branch or remote tracking branch available, an exact `work` vs `main` comparison is not possible in this checkout.

## Best available inference
The tip commit on `work` is:
- `322d85a` "Merge pull request #1 from ryanfeeley/main"

That merge commit has second parent:
- `c17c5ca` "Update featured image in bio.md"

The merge commit tree is identical to the second parent (`c17c5ca`), meaning there are no additional file changes on top of that inferred `main` line.

## What changed between pre-merge work and current work
Comparing first parent `0855c52` to `322d85a`, changed files are:
- `.github/workflows/deploy.yml` (added)
- `CNAME` (added)
- `public/img/julia-algonquin-tree.jpg` (added)
- `src/content/pages/bio.md` (modified)
- `src/templates/Contact.astro` (modified)

These changes are relatively small and focused; this does not look like a large branch divergence in this checkout.
