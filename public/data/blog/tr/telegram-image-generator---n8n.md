---
title: "Telegram Image Generator with n8n: A Step-by-Step Guide"
date: "2024-07-04"
excerpt: "Learn how to automate image generation for Telegram using n8n. This tutorial covers setting up n8n, integrating with image generation APIs, and sending images directly to Telegram."
tags: ["n8n","Telegram","Image Generation","Automation","API"]
coverImage: "/data/images/blog/unity-basics.jpg"
---

## Introduction

In today's digital landscape, automation is key to streamlining workflows and enhancing productivity. Combining Telegram, a popular messaging app, with n8n, a powerful workflow automation platform, opens up possibilities for creative and efficient solutions. This tutorial will guide you through the process of creating a Telegram image generator using n8n, allowing you to automate the generation and delivery of images directly within Telegram.

## Prerequisites

Before we begin, make sure you have the following:

*   **n8n Instance:** You need a running instance of n8n. You can use n8n cloud, a self-hosted instance, or a local installation.
*   **Telegram Bot:** Create a Telegram bot using BotFather and obtain the bot token. This token will be used to authenticate your n8n workflow with Telegram.
*   **Image Generation API Key:** Sign up for an image generation API service like DALL-E, Midjourney, or a similar service. Obtain an API key for authentication.

## Step 1: Setting Up the n8n Workflow

1.  **Create a New Workflow:** Open your n8n instance and create a new workflow. Give it a descriptive name, such as "Telegram Image Generator."

2.  **Telegram Trigger Node:** Add a Telegram Trigger node to start the workflow when a message is received. Configure the node with your Telegram bot token.

    *   Choose the "on message" event to trigger the workflow when the bot receives a message.

3.  **Function Node (Parsing Message):** Add a Function node to parse the incoming Telegram message and extract the user's prompt.

    *   Use JavaScript code to extract the text from the Telegram message.

    ```javascript
    const text = $json.message.text;
    return [{json: {prompt: text}}];
    ```

## Step 2: Integrating with an Image Generation API

1.  **HTTP Request Node:** Add an HTTP Request node to connect to your chosen image generation API. Configure the node with the API endpoint, method (usually POST), and headers (including your API key).

    *   Example configuration for a hypothetical image generation API:

        *   **URL:** `https://api.example.com/generate`
        *   **Method:** POST
        *   **Headers:**

            *   `Content-Type: application/json`
            *   `Authorization: Bearer YOUR_API_KEY`

        *   **Body:**

            ```json
            {
              "prompt": "{{ $json.prompt }}",
              "resolution": "512x512"
            }
            ```

    *   Replace `YOUR_API_KEY` with your actual API key.

2.  **Function Node (Extract Image URL):** Add another Function node to extract the generated image URL from the API response.

    *   The code will depend on the structure of the API response. For example:

    ```javascript
    const imageUrl = $json.data.imageUrl;
    return [{json: {imageUrl: imageUrl}}];
    ```

## Step 3: Sending the Image to Telegram

1.  **HTTP Request Node (Download Image):** Add an HTTP Request node to download the generated image from the URL.

    *   **URL:** `{{ $json.imageUrl }}`
    *   **Method:** GET
    *   **Response:** Set to "Array Buffer"

2.  **Telegram Send Photo Node:** Add a Telegram Send Photo node to send the downloaded image to the user.

    *   Configure the node with your Telegram bot token and the chat ID of the user who sent the initial message.
    *   Set the "Photo" field to the binary data of the downloaded image.

        *   `{{ $binary.data.data }}`
    *   Set the "Chat ID" to the chat ID from the Telegram trigger

        *   `{{ $json.message.chat.id }}`

## Step 4: Testing and Activation

1.  **Test the Workflow:** Send a message to your Telegram bot with a text prompt. Verify that the workflow triggers, generates an image, and sends it back to you.
2.  **Activate the Workflow:** Once you are satisfied with the results, activate the workflow to make it live.

## Example Workflow JSON

```json
{
  "nodes": [
    {
      "parameters": {},
      "id": "7c7a7436-d3a7-4428-a217-68f181e1305b",
      "name": "Telegram Trigger",
      "type": "n8n-nodes-base.telegramTrigger",
      "typeVersion": 1,
      "position": [240, 300]
    },
    {
      "parameters": {
        "jsCode": "const text = $json.message.text;\nreturn [{json: {prompt: text}}];"
      },
      "id": "9e6b4961-a6f9-4795-a88e-a316e7df251a",
      "name": "Function",
      "type": "n8n-nodes-base.function",
      "typeVersion": 1,
      "position": [460, 300]
    },
    {
      "parameters": {
        "requestMethod": "POST",
        "url": "https://api.example.com/generate",
        "options": {},
        "bodyParameters": {
          "parameters": [
            {
              "name": "prompt",
              "value": "{{$json.prompt}}",
              "type": "STRING"
            },
            {
              "name": "resolution",
              "value": "512x512",
              "type": "STRING"
            }
          ]
        },
        "headerParameters": {
          "parameters": [
            {
              "name": "Content-Type",
              "value": "application/json"
            },
            {
              "name": "Authorization",
              "value": "Bearer YOUR_API_KEY"
            }
          ]
        }
      },
      "id": "41c97b32-57a7-4d99-b129-460a050c44ff",
      "name": "HTTP Request",
      "type": "n8n-nodes-base.httpRequest",
      "typeVersion": 1,
      "position": [680, 300]
    },
    {
      "parameters": {
        "jsCode": "const imageUrl = $json.data.imageUrl;\nreturn [{json: {imageUrl: imageUrl}}];"
      },
      "id": "5e723018-0c6e-465d-a2c6-72846e9c7f84",
      "name": "Function1",
      "type": "n8n-nodes-base.function",
      "typeVersion": 1,
      "position": [900, 300]
    },
    {
      "parameters": {
        "requestMethod": "GET",
        "url": "{{$json.imageUrl}}",
        "responseFormat": "arraybuffer",
        "options": {}
      },
      "id": "89d67319-94b3-42f6-9265-e4305d340613",
      "name": "HTTP Request1",
      "type": "n8n-nodes-base.httpRequest",
      "typeVersion": 1,
      "position": [1120, 300]
    },
    {
      "parameters": {
        "chatId": "{{$json.message.chat.id}}",
        "photo": "={{$binary.data.data}}",
        "options": {}
      },
      "id": "3efdbd34-6644-40a7-a601-90489399f5a5",
      "name": "Telegram Send Photo",
      "type": "n8n-nodes-base.telegramSendPhoto",
      "typeVersion": 1,
      "position": [1340, 300]
    }
  ],
  "connections": {
    "Telegram Trigger": {
      "main": [[{"node": "Function", "type": "main", "index": 0}]]
    },
    "Function": {
      "main": [[{"node": "HTTP Request", "type": "main", "index": 0}]]
    },
    "HTTP Request": {
      "main": [[{"node": "Function1", "type": "main", "index": 0}]]
    },
    "Function1": {
      "main": [[{"node": "HTTP Request1", "type": "main", "index": 0}]]
    },
    "HTTP Request1": {
      "main": [[{"node": "Telegram Send Photo", "type": "main", "index": 0}]]
    }
  }
}
```

## Conclusion

By following this tutorial, you have learned how to create a Telegram image generator using n8n. This workflow automates the process of generating images from text prompts and sending them directly to Telegram, opening doors for various applications such as content creation, entertainment, and personalized messaging. Experiment with different image generation APIs and n8n nodes to further customize and enhance your workflow.

