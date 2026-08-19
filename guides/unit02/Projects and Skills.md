## Project 01
### Objectives
Introduce yourself to the Python development environment
### Steps
- Open terminal (we will use command line)
- `% cd swdev` — We need a set up script or zip file to provide directory structure
- `% git init` -- Students will learn basic git commands.
- `% mkdir swdev/proj01`
- Install UV
- Use non-AI editor (we need to choose one) 
	- create hello.py
- Use uv to run hello.py
- `% cd ..` (swdev)
- `% git add .`
- `% git commit -m 'my first program`

## Project 02


- Installing and using `uv` to run Python — likely the first project on its own
- 
- Declaring per-script dependencies (`uv add --script`) so each game file installs what it needs (e.g. pygame) without a shared environment to manage
- Writing a PRD precise enough to drive AI code generation, starting from a shared MVP requirement common to all five assigned games: a box that moves and bounces off the walls
- Working Agile — MVP first, then backlog features added one at a time, rather than specifying the whole game up front
- Prompting Ollama (a local Qwen coding model) one requirement at a time, so a broken result points to one recent change instead of the whole file
- Running the result and testing it against what the PRD actually says
- Writing a plain, written description of what's wrong when a test fails — no screenshots
- Turning that description into a correction prompt, and checking the fix didn't break anything that worked before
- Recognizing why a long AI chat thread slows down — the real cost of growing context, not just an annoyance
- Managing that cost directly: staying in one thread as long as it's fast, restarting with just the current code and an updated PRD once it isn't
- Treating the PRD, not the chat thread, as the actual record of what the project is supposed to do
- Demonstrating the finished game against its own PRD as the final deliverable