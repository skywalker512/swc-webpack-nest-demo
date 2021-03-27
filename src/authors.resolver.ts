import { Args, Int, Resolver, Query } from '@nestjs/graphql';
import { Author } from './author.model';

@Resolver(() => Author)
export class AuthorsResolver {
  @Query(() => Author, { name: 'author' })
  async author(@Args('id', { type: () => Int }) id: number): Promise<Author> {
    return {
      id,
    };
  }
}
