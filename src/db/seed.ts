import db from "@/db/db";
import { faker } from "@faker-js/faker";
import * as bcrypt from "bcrypt";

const TOTAL_USERS = 20;
const TOTAL_ARTICLES_PER_USER = 5;
const TOTAL_CATEGORIES_PER_LANGUAGE = 8;
const TOTAL_TAGS_PER_LANGUAGE = 15;

async function main() {
  // Clean up existing data
  await db.$transaction([
    db.tagsOnArticles.deleteMany({}),
    db.categoriesOnArticles.deleteMany({}),
    db.article.deleteMany({}),
    db.tag.deleteMany({}),
    db.category.deleteMany({}),
    db.user.deleteMany({}),
    db.language.deleteMany({}),
  ]);

  // Create languages
  const languages = await Promise.all([
    db.language.create({
      data: {
        code: "en",
        name: "English",
      },
    }),
    db.language.create({
      data: {
        code: "es",
        name: "Spanish",
      },
    }),
    db.language.create({
      data: {
        code: "fr",
        name: "French",
      },
    }),
  ]);

  // Create users
  const hashedPassword = await bcrypt.hash("password123", 10);

  // Create admin and author users first
  const specialUsers = await Promise.all([
    db.user.create({
      data: {
        email: "admin@example.com",
        username: "admin",
        password: hashedPassword,
        firstName: "Admin",
        lastName: "User",
        role: "ADMIN",
      },
    }),
    db.user.create({
      data: {
        email: "author@example.com",
        username: "author",
        password: hashedPassword,
        firstName: "Author",
        lastName: "User",
        role: "AUTHOR",
      },
    }),
  ]);

  // Create additional random users
  const users = [...specialUsers];
  for (let i = 0; i < TOTAL_USERS - 2; i++) {
    const firstName = faker.person.firstName();
    const lastName = faker.person.lastName();
    const user = await db.user.create({
      data: {
        email: faker.internet.email({ firstName, lastName }),
        username: faker.internet
          .username({ firstName, lastName })
          .toLowerCase(),
        password: hashedPassword,
        firstName,
        lastName,
        role: faker.helpers.arrayElement(["AUTHOR", "EDITOR"]),
      },
    });
    users.push(user);
  }

  // Create categories for each language
  const categories = await Promise.all(
    languages.map(async (language) => {
      const languageCategories = [];
      for (let i = 0; i < TOTAL_CATEGORIES_PER_LANGUAGE; i++) {
        const name = `${faker.word.noun()}-${i + 1} ${language.code}`;
        const category = await db.category.create({
          data: {
            name,
            slug: name.toLowerCase().replace(/\s+/g, "-"),
            description: faker.lorem.sentence(),
            languageId: language.id,
          },
        });
        languageCategories.push(category);
      }
      return languageCategories;
    })
  );

  // Create tags for each language
  const tags = await Promise.all(
    languages.map(async (language) => {
      const languageTags = [];
      for (let i = 0; i < TOTAL_TAGS_PER_LANGUAGE; i++) {
        const name = `${faker.word.noun()}-${i + 1} ${language.code}`;
        const tag = await db.tag.create({
          data: {
            name,
            slug: name.toLowerCase().replace(/\s+/g, "-"),
            languageId: language.id,
          },
        });
        languageTags.push(tag);
      }
      return languageTags;
    })
  );

  // Create articles with categories and tags
  for (const user of users) {
    for (const language of languages) {
      const languageCategories = categories[languages.indexOf(language)];
      const languageTags = tags[languages.indexOf(language)];

      for (let i = 0; i < TOTAL_ARTICLES_PER_USER; i++) {
        const title = `${faker.lorem.sentence()}-${i + 1}`;
        const article = await db.article.create({
          data: {
            title,
            slug: title
              .toLowerCase()
              .replace(/[^a-zA-Z0-9]+/g, "-")
              .replace(/^-+|-+$/g, ""),
            content: faker.lorem.paragraphs(
              faker.number.int({ min: 5, max: 10 })
            ),
            excerpt: faker.lorem.paragraph(),
            status: faker.helpers.arrayElement([
              "DRAFT",
              "PUBLISHED",
              "ARCHIVED",
            ]),
            publishedAt: faker.date.past(),
            languageId: language.id,
            authorId: user.id,
          },
        });

        // Connect random categories (1-3)
        const randomCategories = faker.helpers.arrayElements(
          languageCategories,
          faker.number.int({ min: 1, max: 3 })
        );
        await Promise.all(
          randomCategories.map((category) =>
            db.categoriesOnArticles.create({
              data: {
                articleId: article.id,
                categoryId: category.id,
              },
            })
          )
        );

        // Connect random tags (2-5)
        const randomTags = faker.helpers.arrayElements(
          languageTags,
          faker.number.int({ min: 2, max: 5 })
        );
        await Promise.all(
          randomTags.map((tag) =>
            db.tagsOnArticles.create({
              data: {
                articleId: article.id,
                tagId: tag.id,
              },
            })
          )
        );
      }
    }
  }
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await db.$disconnect();
  });
