# Render Deployment Setup Guide

## Firebase Configuration on Render

### Option 1: Individual Environment Variables (Current Setup)

In your Render dashboard, set these environment variables **without quotes**:

```
FIREBASE_PROJECT_ID=mypg-d6dfb
FIREBASE_CLIENT_EMAIL=firebase-adminsdk-fbsvc@mypg-d6dfb.iam.gserviceaccount.com
FIREBASE_PRIVATE_KEY=-----BEGIN PRIVATE KEY-----\nMIIEvAIBADANBgkqhkiG9w0BAQEFAASCBKYwggSiAgEAAoIBAQDMQW4e1M/6cx8C\nMoZocyCveJyZsFCxgMhRuySTZmbtInKgNe8wcfr06QYLHIyTnmGXGGwXT3UTuKfb\n3DifQ5g3mDDn+nrm7MKbkIfqdY/RcwnbDRfYUUfU+cDWPsF03RE5JB4HkFPe/zsr\nWeDMbB62LEJ4JkFyMH8wPfB/0LwOYClj6cYqYl69q9fZKzRpLKuYg/V+tbauOLTP\nANoeirByatN7VxN2OPuGrOMiF8APMBYRFrn+hTcBtAzDpM4dhBg0JODCF5NHYqTl\n/zGA40Xr3KpZowCIGeZ2TyY6i51Qbn31Cr8u0CAG2Nn6GrufDrEOO0x8VluftgxZ\n8EbqlXRRAgMBAAECggEAB6xmmhnAdXt+h6XacaaaQgABPBneXN4byHbuzRXSBJMg\neh8vQk3p5xUGW9kBo/3AKKhreSW284Z3/JUa+yATjMp20zmQWp1m7egMXx/LByFF\nVm7OaEXyHFDEsJfQy0E53NXGm134n1OjMgH7+sS4vlB5L8vaIL4sgmVf+WFKtgHQ\nJZR8iji7uc1eqf6jgbue/1fhzCpZEqqM2v2/D0eBm1/x+7uEdx6AziHv45RNgp6g\nBCc6EeXEyFTy4NXP/sTzYg07elOa3GlCSoBsqqKJ+0plQsU7xzJnD9VKpNM+SSN5\nSili0kyjoS1qv+vWeXIXe4ithBWzwdnXzDYxbxfENQKBgQDnAgAEWUr8ZZDdgipW\nHw+PC3n8DjKjCH4PmZerMCLtkB/WTqiajjBuoFm9lvmmeVyWQIWC4utAp1rIzYgl\noDpK2Bu8YjQVYB5881xljTi8S8+DC30aqbDL/DnBh7TJQPC9fnNvNqfWP4vg8L4X\n7Pbice9lJpEsuJcZUhGigiB0tQKBgQDiWn/jK/b9/D/FnJNqQYFHL2lbzjKOc45Z\nUYasPzJ+WXibNbFauu2RS8OI7SgW+gCpxDh/7A6xQiid95361t699kYI7VupObdX\nbfTKgd4zuShCm6MxnVY7Ds2gKUoTSDodE0iPa1v7FkZnYbLUcuB0mMMOXBlMuKrc\nZIpGl0/+rQKBgARTMkLilRfSovqytC42mKj58we4EFSjFREftAo9dXnzJ9VwVZHH\nNbrsf6GgEP5/6S7a+GTx8KueNoHp7zGdJVo/X42QXR9FVGzMdZ9lHHnSBYmTjn0Q\nTkITb9ViwAzAjYFOu8SKRmwpdmn4t+Zkxl6I+Y1wQmmO7y1HLxNW0lq9AoGAZJwp\nQAZosJgQmHtyIsae+c8fG4lZe2vtl9He9GzausJ2EzcYb+WqduygKxqOuTfCV7M6\nEdIQ7cUkXKKVe8tKElGG66zlEyDuV1QufFyhMYhZVtHrBcCTdYis6UWxAUUXX5kU\npXro1YAfJxCL9lZhYjIMcTOKo0lp2LBvrdTP37kCgYAPdr0yAZNiF+ODQuRZnufU\nRxgOrjCC6sTcUKQ7u4BlbBqIw+WT9B2mVIGw5mX4hQpx1arZMpYS80aIYY8UdUG2\n2YZRIb15/pXFnc7NafQrckvqvlcD6juusXK30JR5GVbddyRpS2rt52kgvACo3qeV\nLx4gfpAJBPi2A93+O/sfoQ==\n-----END PRIVATE KEY-----
```

**Key points:**
- No quotes around the value
- Keep `\n` as literal `\n` (not actual line breaks)
- The code will convert them to actual newlines

### Option 2: JSON Service Account (More Reliable)

If Option 1 doesn't work, use a single JSON environment variable:

1. In Render, create an environment variable called `FIREBASE_SERVICE_ACCOUNT`
2. Set its value to (minified, single line):

```json
{"type":"service_account","project_id":"mypg-d6dfb","private_key_id":"YOUR_PRIVATE_KEY_ID","private_key":"-----BEGIN PRIVATE KEY-----\nMIIEvAIBADANBgkqhkiG9w0BAQEFAASCBKYwggSiAgEAAoIBAQDMQW4e1M/6cx8C\nMoZocyCveJyZsFCxgMhRuySTZmbtInKgNe8wcfr06QYLHIyTnmGXGGwXT3UTuKfb\n3DifQ5g3mDDn+nrm7MKbkIfqdY/RcwnbDRfYUUfU+cDWPsF03RE5JB4HkFPe/zsr\nWeDMbB62LEJ4JkFyMH8wPfB/0LwOYClj6cYqYl69q9fZKzRpLKuYg/V+tbauOLTP\nANoeirByatN7VxN2OPuGrOMiF8APMBYRFrn+hTcBtAzDpM4dhBg0JODCF5NHYqTl\n/zGA40Xr3KpZowCIGeZ2TyY6i51Qbn31Cr8u0CAG2Nn6GrufDrEOO0x8VluftgxZ\n8EbqlXRRAgMBAAECggEAB6xmmhnAdXt+h6XacaaaQgABPBneXN4byHbuzRXSBJMg\neh8vQk3p5xUGW9kBo/3AKKhreSW284Z3/JUa+yATjMp20zmQWp1m7egMXx/LByFF\nVm7OaEXyHFDEsJfQy0E53NXGm134n1OjMgH7+sS4vlB5L8vaIL4sgmVf+WFKtgHQ\nJZR8iji7uc1eqf6jgbue/1fhzCpZEqqM2v2/D0eBm1/x+7uEdx6AziHv45RNgp6g\nBCc6EeXEyFTy4NXP/sTzYg07elOa3GlCSoBsqqKJ+0plQsU7xzJnD9VKpNM+SSN5\nSili0kyjoS1qv+vWeXIXe4ithBWzwdnXzDYxbxfENQKBgQDnAgAEWUr8ZZDdgipW\nHw+PC3n8DjKjCH4PmZerMCLtkB/WTqiajjBuoFm9lvmmeVyWQIWC4utAp1rIzYgl\noDpK2Bu8YjQVYB5881xljTi8S8+DC30aqbDL/DnBh7TJQPC9fnNvNqfWP4vg8L4X\n7Pbice9lJpEsuJcZUhGigiB0tQKBgQDiWn/jK/b9/D/FnJNqQYFHL2lbzjKOc45Z\nUYasPzJ+WXibNbFauu2RS8OI7SgW+gCpxDh/7A6xQiid95361t699kYI7VupObdX\nbfTKgd4zuShCm6MxnVY7Ds2gKUoTSDodE0iPa1v7FkZnYbLUcuB0mMMOXBlMuKrc\nZIpGl0/+rQKBgARTMkLilRfSovqytC42mKj58we4EFSjFREftAo9dXnzJ9VwVZHH\nNbrsf6GgEP5/6S7a+GTx8KueNoHp7zGdJVo/X42QXR9FVGzMdZ9lHHnSBYmTjn0Q\nTkITb9ViwAzAjYFOu8SKRmwpdmn4t+Zkxl6I+Y1wQmmO7y1HLxNW0lq9AoGAZJwp\nQAZosJgQmHtyIsae+c8fG4lZe2vtl9He9GzausJ2EzcYb+WqduygKxqOuTfCV7M6\nEdIQ7cUkXKKVe8tKElGG66zlEyDuV1QufFyhMYhZVtHrBcCTdYis6UWxAUUXX5kU\npXro1YAfJxCL9lZhYjIMcTOKo0lp2LBvrdTP37kCgYAPdr0yAZNiF+ODQuRZnufU\nRxgOrjCC6sTcUKQ7u4BlbBqIw+WT9B2mVIGw5mX4hQpx1arZMpYS80aIYY8UdUG2\n2YZRIb15/pXFnc7NafQrckvqvlcD6juusXK30JR5GVbddyRpS2rt52kgvACo3qeV\nLx4gfpAJBPi2A93+O/sfoQ==\n-----END PRIVATE KEY-----\n","client_email":"firebase-adminsdk-fbsvc@mypg-d6dfb.iam.gserviceaccount.com","client_id":"YOUR_CLIENT_ID","auth_uri":"https://accounts.google.com/o/oauth2/auth","token_uri":"https://oauth2.googleapis.com/token","auth_provider_x509_cert_url":"https://www.googleapis.com/oauth2/v1/certs","client_x509_cert_url":"https://www.googleapis.com/robot/v1/metadata/x509/firebase-adminsdk-fbsvc%40mypg-d6dfb.iam.gserviceaccount.com"}
```

Then update the code to use it (see alternative implementation below).

### Option 3: Use Render Secret Files

1. Go to your Render service settings
2. Add a **Secret File** (more secure than environment variables)
3. Name it: `/etc/secrets/firebase-service-account.json`
4. Paste the full JSON from your Firebase service account
5. Update code to read from the file

## Other Environment Variables

Also set in Render:

```
MONGODB_URI=mongodb+srv://menueaswaran_db_user:kumar123@cluster0.tqumiak.mongodb.net/mgpg
PORT=3333
NODE_ENV=production
```

## Troubleshooting

If you still get the error:
1. Check Render logs to see the actual value being passed
2. Add debug logging before Firebase initialization:
   ```javascript
   console.log('Private key length:', process.env.FIREBASE_PRIVATE_KEY?.length);
   console.log('First 50 chars:', process.env.FIREBASE_PRIVATE_KEY?.substring(0, 50));
   ```
3. Try the JSON service account method (Option 2)
4. Consider using Render Secret Files (Option 3)
