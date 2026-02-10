
  # StoryForge

  This is a code bundle for StoryForge. The original project is available at https://www.figma.com/design/vieh12mSRs6iazpf4XmC4i/StoryForge.

  ## Running the code

  Run `npm i` to install the dependencies.

  Run `npm run dev` to start the development server.

## Agent provider configuration

By default, the app uses local mock agents.

To enable Foundry, create a `.env` file in project root:

```env
VITE_AGENT_PROVIDER=foundry
VITE_FOUNDRY_ENDPOINT=https://your-foundry-endpoint
VITE_FOUNDRY_API_KEY=your-api-key
VITE_FOUNDRY_PROJECT_ID=optional-project-id
```

If Foundry is unreachable or misconfigured, the app automatically falls back to Mock mode and shows a popup error.
  
