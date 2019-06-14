# scheduled-habitica-tasks
A Google script that posts all the day's events in a specific Google calendar as Habitica to-do's. The event title becomes the task itself, the event notes are converted to task notes! As an added bonus, every line in the event notes that starts with "- " (i.e. bullet points) are converted to sub-tasks. 

## Instructions
Getting this up and running should be pretty easy. I think. I sort of typed this together between meetings, so feel free to call me on it if I made a boo-boo.

1. Start a new Google script project at script.google.com.
1. Copy-paste the contents of `scheduled-habitica-tasks` (the only other file in this repository) into the editor. 
1. Replace the values for `USER_ID` and `API_TOKEN`, found in the first two lines, with your own user ID and API token. You can find these in your Habitica settings under API. E.g. `var USER_ID = "09481-285j-fj09f-j209-3j59"`
1. In the script editor, add a new script trigger with Edit > Current project's triggers > Add Trigger. Have it run `scheduleTasks` at a set time every day. I have it set to four am.
1. Add a calendar to your Google calendar named HabiticaReminders.
1. Test it! Add something to HabiticaReminder for today and run the script by selecting `scheduledTasks` from the drop-down in the editor ribbon and hitting the play button. 
1. You probably have to add permissions somewhere? Presumably Google scripts will ask you about it as soon as you run the script? 
1. ???
1. Profit. 

I think. Again, typed this up during a fifteen minute break. If anything isn't clear or errors start popping up, feel free to submit an issue or send me a message. 
