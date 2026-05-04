<!-- prev: features.md | next: ../04-retrospective/index.md -->

# FAQ and Troubleshooting

## Common Questions

**Q: Can guests fill every form?**  
A: No. Guests can fill only templates marked as public. Private forms require authenticated access.

**Q: Can public access be disabled after publishing?**  
A: Yes. The owner can use the Make private action on the template list.

**Q: Are correct answers visible to guests?**  
A: No. Public template responses do not expose correct answer fields.

**Q: What happens if a form is deleted?**  
A: The template and related questions/responses are removed according to database relationships.

**Q: Does analytics use random data?**  
A: No. Analytics is calculated from real response records and real backend events.

## Troubleshooting

| Issue | Possible Cause | Solution |
|-------|----------------|----------|
| Login fails | Wrong credentials or backend unavailable. | Check credentials and backend health URL. |
| Public form does not open | Template is private or public access was disabled. | Make the template public if access should be allowed. |
| CORS error in browser | Vercel URL is not allowed by backend. | Update `CORS_ORIGIN` in Railway and redeploy backend. |
| New question features fail in production | Database migration not applied. | Run the latest Railway SQL migration. |
| Live analytics not updating | SSE connection interrupted. | Refresh page or check backend connection. |

## Browser Compatibility

| Browser | Status |
|---------|--------|
| Chrome | Supported |
| Firefox | Supported |
| Safari | Supported |
| Edge | Supported |

## Support During Evaluation

If the cloud deployment is unavailable, the application can be demonstrated locally using Docker Compose. The repository contains run instructions and environment examples.
