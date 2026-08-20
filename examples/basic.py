"""Minimal example for ReminderBot."""

from reminderbot import reminderbot


def main():
 runner = reminderbot({"name": "ReminderBot", "dry_run": False})
 result = runner.execute()
 print(result)


if __name__ == "__main__":
 main()