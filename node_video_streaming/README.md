PROS

- simple to efficient
- create a file stream, send back to client
- scrubbing video works
- can decide how big the chunk to send back per request
  - on our example, we did 1MB
  - can send smaller 
  - THOUGHTS: how does youtube do adaptive resolution

CONS
- server and video player aren't working very well
- request whatever part of the video you're on
- doesn't take into account what was already requested
  - if you go back to a part already watched, it requests it again
- In fact, if you scrub entire video a few times, you could request 3x the video size
  - when you could have requested entire video and cached it for the player

Improvement:
- save data on frontend, so video player doesn't re-request already downloaded parts