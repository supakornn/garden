---
created: 2026-06-10
tags:
  - seed
title: " Insecure Direct Object Reference (IDOR)"
---
**IDOR** stands for _Insecure Direct Object Reference_. It happens when an app lets you access someone else’s data by changing an ID, because it doesn’t check your permission.

For example, changing `/invoices/123` to `/invoices/124` lets you see another person’s invoice.

It can also let you edit or delete their data.

> Knowing an item’s ID doesn’t mean you’re allowed to access it.

To prevent IDOR, the server must check your permission every time you access an item. Using random IDs or UUIDs alone doesn’t fix it.