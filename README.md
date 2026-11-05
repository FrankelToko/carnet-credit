# Carnet de crédit numérique

Application mobile-first qui remplace le cahier de crédit des petits commerçants : noter ce que chaque client doit, enregistrer les paiements, relancer par WhatsApp.

> **Statut : en développement** (conception terminée, MVP en cours).

## Le problème

Beaucoup de commerçants (boutiques, quincailleries, marchés) vendent à crédit et notent tout sur un cahier. Les dettes s'oublient, se perdent, et on n'ose pas toujours relancer. Ce projet propose un outil aussi simple que le cahier, qui calcule les soldes et aide à relancer.

## Principes de conception

- **Simplicité avant tout** : trois actions à l'accueil (*Il me doit*, *Il a payé*, liste des clients). Un crédit s'enregistre en moins de 10 secondes.
- **Mobile-first** : pensé pour un Android d'entrée de gamme, à partir de 360 px de large.
- **Connexion instable** : fonctionnement hors ligne prévu (PWA, synchronisation différée).
- **Le client n'a pas de compte** : seul le commerçant utilise l'application, le client reçoit des messages.
- **Données fiables** : le solde est calculé, jamais stocké ; les transactions ne se modifient pas, on ajoute une correction.

## Fonctionnalités du MVP

- [ ] Connexion du commerçant (téléphone + PIN)
- [ ] Gestion des clients
- [ ] Enregistrement des crédits et des paiements
- [ ] Solde par client et total des créances
- [ ] Reçu et relance par lien WhatsApp
- [ ] Interface mobile en français

## Prévu après le MVP

Mode hors ligne, connexion par OTP SMS, relances automatiques, reçus PDF, export, statistiques, score de fiabilité des clients, paiement Mobile Money.

## Stack technique

| Couche | Technologie |
|---|---|
| Backend | Django, Django REST Framework, JWT |
| Base de données | PostgreSQL |
| Frontend | React, Tailwind CSS, PWA |
| Tests et qualité | pytest-django, ruff |

## Structure du dépôt

```
carnet-credit/
├── backend/    # API Django (apps : accounts, customers, ledger)
└── frontend/   # Application React (PWA)
```

## Installation (backend)

```bash
cd backend
python3 -m venv .venv && source .venv/bin/activate
pip install -r requirements.txt
cp .env.example .env   # puis renseigner les valeurs
python manage.py migrate
python manage.py runserver
```

## Tests

```bash
cd backend && pytest
```

## Auteur

Ange Frankel LEUDJEU TOKO, développeur logiciel, Douala (Cameroun).
