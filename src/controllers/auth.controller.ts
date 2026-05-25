import {
  Controller,
  Post,
  Body,
  UseGuards,
  BadRequestException,
} from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { AuthService } from '../services/auth.service';
import { UserService } from '../services/user.service';
import { LoginDto } from '../dto/login.dto';
import { CreateUserDto } from '../dto/create-user.dto';
import { RolesGuard, RequireRoles } from '../config/roles.guard';
import { Roles } from 'src/enums/Roles';

@Controller('auth')
export class AuthController {
  constructor(
    private readonly authService: AuthService,
    private readonly userService: UserService,
  ) {}

  @Post('login')
  login(@Body() dto: LoginDto) {
    return this.authService.login(dto);
  }

  @Post('users')
  @UseGuards(AuthGuard('jwt'), RolesGuard)
  @RequireRoles(Roles.ADMIN)
  createUser(@Body() dto: CreateUserDto) {
    return this.authService.createUser(dto);
  }

  // ── MSAL MOBILE CALLBACK (Android/iOS) ──────────────────────────────────
  // Reçoit le code d'autorisation, l'échange contre un token Microsoft,
  // récupère le profil, puis retourne un JWT applicatif
  @Post('msal-mobile-callback')
  async msalMobileCallback(@Body() body: { code: string }) {
    if (!body.code) throw new BadRequestException('code manquant');

    const clientId = 'f5515d18-8765-4ae6-8b08-2b4b8ad66611';
    const tenantId = 'dc59e38c-4977-406f-bdd1-9ebbabbd387e';
    const redirectUri = 'msauth://ma.ac.usms.newsroom/auth';

    // 1. Échanger le code contre un access_token Microsoft
    const tokenRes = await fetch(
      `https://login.microsoftonline.com/${tenantId}/oauth2/v2.0/token`,
      {
        method: 'POST',
        headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
        body: new URLSearchParams({
          client_id: clientId,
          grant_type: 'authorization_code',
          code: body.code,
          redirect_uri: redirectUri,
          scope: 'openid profile email',
        }).toString(),
      },
    );

    const tokenData = await tokenRes.json();
    if (!tokenData.access_token) {
      throw new BadRequestException(
        'Échange du code Microsoft échoué: ' + JSON.stringify(tokenData),
      );
    }

    // 2. Récupérer le profil utilisateur depuis Microsoft Graph
    const profileRes = await fetch('https://graph.microsoft.com/v1.0/me', {
      headers: { Authorization: `Bearer ${tokenData.access_token}` },
    });
    const profile = await profileRes.json();

    const email = (
      profile.mail ||
      profile.userPrincipalName ||
      ''
    ).toLowerCase();
    if (!email)
      throw new BadRequestException(
        "Impossible de récupérer l'email depuis Microsoft",
      );

    const nom = profile.surname || email.split('@')[0];
    const prenom = profile.givenName || '';

    // 3. Trouver ou créer l'utilisateur en base, générer un JWT applicatif
    const user = await this.userService.findOrCreateByEmail(email, nom, prenom);

    if (!user) {
      throw new BadRequestException(
        "Impossible de trouver ou créer l'utilisateur",
      );
    }

    const token = await this.authService.generateToken(user);

    return {
      access_token: token,
      user: {
        id: user.id,
        nom: user.nom,
        prenom: user.prenom,
        email: user.email,
        role: user.role?.nomRole ?? user.role,
      },
    };
  }
}
