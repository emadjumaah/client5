import { ApolloClient, createHttpLink, InMemoryCache } from "@apollo/client";
import { setContext } from "@apollo/client/link/context";

const stringstore = localStorage.getItem("store");
const store = stringstore ? JSON.parse(stringstore) : null;

const token = store ? store.token : null;

// local
// uri: "http://jadwal-main:4000/graphql",
const httpLink = createHttpLink({
  uri: process.env.GRAPHQL_URI,
});

const authLink = setContext((_, { headers }) => {
  return {
    headers: {
      ...headers,
      authorization: token ? `Jadwal ${token}` : "",
    },
  };
});

export const client = new ApolloClient({
  link: authLink.concat(httpLink),
  cache: new InMemoryCache(),
});
