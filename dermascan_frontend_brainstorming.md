cat > ROADMAP.md << 'EOF'

# DermaScan+ Roadmap

## Notifications

- Schema: replace `isCompleted` and `isNotified` in `routineNotifications` with `lastCompletedAt datetime nullable`
- Insert one row per product when user saves recommendation
- Fetch on routine screen, derive completed/pending from `dayjs(lastCompletedAt).isSame(dayjs(), 'day')`
- User taps done → update `lastCompletedAt` to now
- Add `userSchedule` table for AM/PM times, prompt user after checkout
- Week 6 check: on app load, if earliest `routineNotifications.createdAt` is 42+ days ago and recent journal moods are bad/neutral → show derma referral

## Recommendation Logic

- Add `ingredients` table + `condition_ingredients` junction
- Use it in `scoreProducts` to boost products with beneficial ingredients per condition
- Replaces hardcoded map, makes it queryable and defensible to panel

## Journals

- Add `mood varchar nullable` to journals table
- Update backend create/update to accept mood
- Frontend: emoji picker (😊 😐 😞) in bottom sheet above text input
- Calendar: color code dates by mood (green/yellow/red)
- Mood data feeds into week 6 derma referral check
  EOF
