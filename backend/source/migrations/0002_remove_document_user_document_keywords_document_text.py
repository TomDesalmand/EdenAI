# Generated by Django 5.0.1 on 2024-01-12 18:02

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('source', '0001_initial'),
    ]

    operations = [
        migrations.RemoveField(
            model_name='document',
            name='user',
        ),
        migrations.AddField(
            model_name='document',
            name='keywords',
            field=models.TextField(blank=True, null=True),
        ),
        migrations.AddField(
            model_name='document',
            name='text',
            field=models.TextField(blank=True, null=True),
        ),
    ]
