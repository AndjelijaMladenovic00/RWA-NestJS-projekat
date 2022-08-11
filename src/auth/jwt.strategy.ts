import { Injectable } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { ExtractJwt, Strategy } from 'passport-jwt';

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
  constructor() {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      ignoreExparation: false,
      secretOrKey: 'FicSezUSCq8jEnLeJQqV7UvRw87qum41sPqaHKzjQZE',
    });
  }

  async validate(payload: any) {
    return {
      id: payload.sub,
      username: payload.name,
      profileType: payload.profileType,
    };
  }
}
