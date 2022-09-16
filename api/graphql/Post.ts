import { nonNull, objectType, extendType, stringArg } from "nexus";

export const Post = objectType({
  name: "Post",
  definition(t) {
    t.int("id"); // Field name 'id of type "Int"
    t.string("title");
    t.string("body");
    t.boolean("published");
  },
});

export const PostQuery = extendType({
  type: "Query",
  definition(t) {
    t.nonNull.list.field("drafts", {
      type: "Post",
      resolve(_root, _args, ctx) {
        return ctx.db.posts.filter((p) => p.published === false);
      },
    });
    // t.field("drafts", {
    //   type: nonNull(list("Post")),
    //   resolve() {
    //     return [{ id: 1, title: "whyyy", body: "...", published: false }];
    //   },
    //   //   resolve(_root, _args, ctx) {
    //   //     return ctx.db.posts.filter((p) => {
    //   //       console.log("PPP", p);
    //   //       p.published === false;
    //   //     });
    //   //   },
    // });
  },
});

// t.field("drafts", {
//   type: nonNull(list("Post")),
//   resolve() {
//     return [{ id: 1, title: "Nexus", body: "...", published: false }];
//   },
// });

export const PostMutation = extendType({
  type: "Mutation",
  definition(t) {
    t.nonNull.field("createDraft", {
      type: "Post",
      args: {
        title: nonNull(stringArg()),
        body: nonNull(stringArg()),
      },
      resolve(_root, args, ctx) {
        const draft = {
          id: ctx.db.posts.length + 1,
          title: args.title,
          body: args.body,
          published: false,
        };
        ctx.db.posts.push(draft);
        return draft;
      },
    });
  },
});
